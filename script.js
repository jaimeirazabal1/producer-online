class MusicProducer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
        this.currentStep = 0;
        this.bpm = 120;
        this.metronomeBpm = 120;
        this.metronomeVolume = 0.5;
        this.isMetronomeOn = false;
        this.metronomeInterval = null;
        this.pattern = new Array(8).fill(false);
        this.drumPatterns = {
            kick: new Array(8).fill(false),
            snare: new Array(8).fill(false),
            hihat: new Array(8).fill(false),
            cymbal: new Array(8).fill(false)
        };
        this.oscillator = null;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.soundCache = {};
        this.metronomeSound = null;
        
        this.initUI();
        this.setupEventListeners();
    }

    initUI() {
        // Inicializar el display del BPM
        document.getElementById('bpm-display').textContent = `${this.bpm} BPM`;
    }

    setupEventListeners() {
        // Eventos del sintetizador
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', () => this.playNote(key.dataset.note));
        });

        // Eventos del secuenciador
        const cells = document.querySelectorAll('.pattern-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const step = parseInt(cell.dataset.step);
                this.pattern[step] = !this.pattern[step];
                cell.classList.toggle('active');
            });
        });

        // Eventos de batería
        const drumKeys = document.querySelectorAll('.drum-key');
        drumKeys.forEach(key => {
            key.addEventListener('click', () => this.playDrum(key.dataset.instrument));
        });

        const drumCells = document.querySelectorAll('.drum-cell');
        drumCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const step = parseInt(cell.dataset.step);
                const instrument = cell.parentElement.dataset.instrument;
                this.drumPatterns[instrument][step] = !this.drumPatterns[instrument][step];
                cell.classList.toggle('active');
            });
        });

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                'q': 'kick',
                'w': 'snare',
                'e': 'hihat',
                'r': 'cymbal'
            };

            const instrument = keyMap[e.key.toLowerCase()];
            if (instrument) {
                this.playDrum(instrument);
            }
        });

        // Eventos de control
        document.getElementById('play').addEventListener('click', () => this.start());
        document.getElementById('stop').addEventListener('click', () => this.stop());
        document.getElementById('bpm').addEventListener('input', (e) => {
            this.bpm = parseInt(e.target.value);
            document.getElementById('bpm-display').textContent = `${this.bpm} BPM`;
        });

        // Eventos del metrónomo
        document.getElementById('metronome-toggle').addEventListener('click', () => this.toggleMetronome());
        document.getElementById('metronome-bpm').addEventListener('input', (e) => {
            this.metronomeBpm = parseInt(e.target.value);
            document.getElementById('metronome-bpm-display').textContent = `${this.metronomeBpm} BPM`;
        });
        document.getElementById('metronome-volume').addEventListener('input', (e) => {
            this.metronomeVolume = e.target.value / 100;
            document.getElementById('metronome-volume-display').textContent = `${Math.round(this.metronomeVolume * 100)}%`;
        });
    }

    playNote(note) {
        const frequency = this.noteToFrequency(note);
        
        if (this.oscillator) {
            this.oscillator.stop();
        }

        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = frequency;
        
        const volume = document.getElementById('volume').value / 100;
        this.gainNode.gain.value = volume;
        
        this.oscillator.connect(this.gainNode);
        this.oscillator.start();
        this.oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    async loadSound(url) {
        if (this.soundCache[url]) {
            return this.soundCache[url];
        }

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.soundCache[url] = audioBuffer;

        // Cargar el sonido del metrónomo si no está cargado
        if (!this.metronomeSound) {
            try {
                const metronomeResponse = await fetch('sounds/metronome/metronome-85688.mp3');
                if (!metronomeResponse.ok) {
                    throw new Error('Error loading metronome sound');
                }
                const metronomeBuffer = await metronomeResponse.arrayBuffer();
                this.metronomeSound = await this.audioContext.decodeAudioData(metronomeBuffer);
            } catch (error) {
                console.error('Error loading metronome sound:', error);
            }
        }

        return audioBuffer;
    }

    playSound(soundBuffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = soundBuffer;
        source.connect(this.gainNode);
        source.start();
    }

    async playDrum(instrument) {
        // Activar la luz del instrumento
        const drumKey = document.querySelector(`.drum-key[data-instrument="${instrument}"]`);
        if (drumKey) {
            drumKey.classList.add('active');
            setTimeout(() => drumKey.classList.remove('active'), 100);
        }

        const soundPicker = document.querySelector(`.sound-picker[data-instrument="${instrument}"]`);
        const soundUrl = soundPicker.value;
        const soundBuffer = await this.loadSound(soundUrl);
        this.playSound(soundBuffer);
    }

    async playMetronome() {
        if (!this.metronomeSound) {
            try {
                const metronomeResponse = await fetch('sounds/metronome/metronome-85688.mp3');
                if (!metronomeResponse.ok) {
                    throw new Error('Error loading metronome sound');
                }
                const metronomeBuffer = await metronomeResponse.arrayBuffer();
                this.metronomeSound = await this.audioContext.decodeAudioData(metronomeBuffer);
            } catch (error) {
                console.error('Error loading metronome sound:', error);
                return;
            }
        }

        const gain = this.audioContext.createGain();
        gain.gain.value = this.metronomeVolume;
        gain.connect(this.audioContext.destination);

        const source = this.audioContext.createBufferSource();
        source.buffer = this.metronomeSound;
        source.connect(gain);
        source.start();
    }

    async toggleMetronome() {
        if (this.isMetronomeOn) {
            clearInterval(this.metronomeInterval);
            this.isMetronomeOn = false;
            document.getElementById('metronome-toggle').textContent = 'Metronome';
        } else {
            try {
                // Asegurarse de que el sonido esté cargado
                await this.playMetronome();
                
                this.isMetronomeOn = true;
                document.getElementById('metronome-toggle').textContent = 'Stop Metronome';

                const stepDuration = 60 / this.metronomeBpm;
                this.metronomeInterval = setInterval(async () => {
                    await this.playMetronome();
                }, stepDuration * 1000);
            } catch (error) {
                console.error('Error starting metronome:', error);
                alert('Error starting metronome. Please try again.');
            }
        }
    }

    noteToFrequency(note) {
        const notes = {
            'C4': 261.63,
            'C#4': 277.18,
            'D4': 293.66,
            'D#4': 311.13,
            'E4': 329.63,
            'F4': 349.23,
            'F#4': 369.99,
            'G4': 392.00,
            'G#4': 415.30,
            'A4': 440.00,
            'A#4': 466.16,
            'B4': 493.88
        };
        
        return notes[note] || 440; // A4 por defecto
    }

    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.sequence();
    }

    stop() {
        this.isPlaying = false;
        this.currentStep = 0;
    }

    sequence() {
        if (!this.isPlaying) return;

        // Reproducir el metrónomo en el primer paso de cada compás
        if (this.currentStep === 0) {
            this.playMetronome();
        }

        // Reproducir la nota del sintetizador si está activa en este paso
        if (this.pattern[this.currentStep]) {
            const note = `C${document.getElementById('octave').value}`;
            this.playNote(note);
        }

        // Reproducir los instrumentos de batería si están activos en este paso
        Object.entries(this.drumPatterns).forEach(([instrument, pattern]) => {
            if (pattern[this.currentStep]) {
                this.playDrum(instrument);
            }
        });

        // Actualizar los pasos activos
        const cells = document.querySelectorAll('.pattern-cell');
        cells.forEach(cell => cell.classList.remove('active-step'));
        cells[this.currentStep].classList.add('active-step');

        // Actualizar los pasos activos de la batería
        const drumCells = document.querySelectorAll(`.drum-cell[data-step="${this.currentStep}"]`);
        drumCells.forEach(cell => cell.classList.add('active-step'));

        // Avanzar al siguiente paso
        this.currentStep = (this.currentStep + 1) % 8;

        // Calcular el tiempo hasta el siguiente paso
        const stepDuration = 60 / this.bpm;
        setTimeout(() => this.sequence(), stepDuration * 1000);
    }
}

// Inicializar la aplicación cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new MusicProducer();
});
