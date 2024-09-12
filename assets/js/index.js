const themeSwitch = document.getElementById("theme-switch")

themeSwitch.checked = localStorage.getItem("lightTheme") === "true";

themeSwitch.addEventListener("change", e => {
    e.currentTarget.checked === true
        ? localStorage.setItem("lightTheme", "true")
        : localStorage.removeItem("lightTheme")
})

const tempoRange = document.getElementById("tempo-range")
const tempoValue = document.getElementById("tempo-value")
const decreaseTempo = document.getElementById("decrease-tempo")
const increaseTempo = document.getElementById("increase-tempo")

const metronome = new Metronome()
const playSwitch = document.getElementById("play-switch")

playSwitch.addEventListener("click", () => {
    metronome.startStop()
})

document.addEventListener("keydown", event => {
    if(event.code === "Space"){
        metronome.startStop()
        playSwitch.checked = !playSwitch.checked
    }
})

const divisions = document.querySelectorAll(".divisions")

let divisionMultiplier = 1
let activatedDivision = 1

for(const division of divisions){
    division.multiplier = divisionMultiplier
    divisionMultiplier += 1

    division.addEventListener("click", () => {
        for(const activeDivision of divisions){
            activeDivision.classList.remove("selected")
        }
        division.classList.add("selected")
        activatedDivision = division.multiplier

        updateTempo()
    })
}

tempoRange.value = localStorage.getItem("tempo")

const updateTempo = () => {
    tempoValue.textContent = tempoRange.value + " BPM"
    metronome.tempo = tempoRange.valueAsNumber * activatedDivision
    metronome.changeBeatsPerBar(activatedDivision) 

    localStorage.setItem("tempo", tempoRange.value)
}

updateTempo()

decreaseTempo.addEventListener("click", () => {
    tempoRange.value = tempoRange.valueAsNumber - 5
    updateTempo()
})

document.addEventListener("keydown", event => {
    if(event.code == "ArrowLeft"){
        tempoRange.value = tempoRange.valueAsNumber - 5
        updateTempo()
    }
})

increaseTempo.addEventListener("click", () => {
    tempoRange.value = tempoRange.valueAsNumber + 5
    updateTempo()
})

document.addEventListener("keydown", event => {
    if(event.code == "ArrowRight"){
        tempoRange.value = tempoRange.valueAsNumber + 5
        updateTempo()
    }
})

tempoRange.addEventListener("input", () => {
    updateTempo()
})
