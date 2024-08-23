class Metronome{
    constructor(tempo = 0, beats = 1){
        this.audioContext = null
        this.notesInQueue = []
        this.currentBeatInBar = 0
        this.beatsPerBar = beats
        this.tempo = tempo
        this.lookAhead = 25
        this.scheduleAheadTime = 0.1
        this.nextNoteTime = 0.0
        this.isRunning = false
        this.interval = null
    }

    changeBeatsPerBar(beats){
        this.beatsPerBar = beats
    }

    nextNote(){
        const secondsPerBeat = (60.0 / this.tempo)

        this.nextNoteTime += secondsPerBeat
        this.currentBeatInBar++

        if(this.currentBeatInBar == this.beatsPerBar){
            this.currentBeatInBar = 0
        }
    }

    scheduleNote(beatNumber, time){
        this.notesInQueue.push(
            {
                note: beatNumber,
                time: time
            }
        )

        const oscillator = this.audioContext.createOscillator()
        const envelope = this.audioContext.createGain()

        oscillator.frequency.value = (beatNumber % this.beatsPerBar == 0) 
            ? 1500 
            : 800

        envelope.gain.value = 1
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001)
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02)

        oscillator.connect(envelope)
        envelope.connect(this.audioContext.destination)

        oscillator.start(time)
        oscillator.stop(time + 0.03)
    }

    scheduler(){
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
            this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
            this.nextNote();
        }
    }

    start(){
        if(this.isRunning) return

        if(this.audioContext == null){
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        }

        this.isRunning = true
        this.currentBeatInBar = 0
        this.nextNoteTime = this.audioContext.currentTime + 0.05
        this.interval = setInterval(() => this.scheduler(), this.lookAhead)
    }

    stop(){
        this.isRunning = false

        clearInterval(this.interval)
    }

    startStop(){
        if(this.isRunning){
            this.stop()
        }else{
            this.start()
        }
    }
}