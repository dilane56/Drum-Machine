import '../styles/Main.css';
import heater1 from "../audio/Heater-1.mp3";
import heater2 from "../audio/Heater-2.mp3";
import heater3 from "../audio/Heater-3.mp3";
import heater4 from "../audio/Heater-4_1.mp3";
import clap from "../audio/Heater-6.mp3";
import openHH from "../audio/Dsc_Oh.mp3";
import kicknHat from "../audio/Kick_n_Hat.mp3";
import kick from "../audio/RP4_KICK_1.mp3";
import closedHH from "../audio/Cev_H2.mp3";
import logo from "../images/icons8-freecodecamp.png";
import { audio2 } from '../data/data';
import { useState, useEffect, useRef } from 'react';

export default function Main() {
    const audio = [
        {
            KeyCode: 81,
            id: "Heater-1",
            src: heater1,
            btn: 'Q'
        },
        {
            KeyCode: 87,
            id: "Heater-2",
            src: heater2,
            btn: 'W'
        },
        {
            KeyCode: 69,
            id: "Heater-3",
            src: heater3,
            btn: 'E'
        },
        {
            KeyCode: 65,
            id: "Heater-4",
            src: heater4,
            btn: 'A'
        },
        {
            KeyCode: 83,
            id: "Clap",
            src: clap,
            btn: 'S'
        },
        {
            KeyCode: 68,
            id: "Open-HH",
            src: openHH,
            btn: 'D'
        },
        {
            KeyCode: 90,
            id: "Kick-n'-Hat",
            src: kicknHat,
            btn: 'Z'
        },
        {
            KeyCode: 88,
            id: "Kick",
            src: kick,
            btn: 'X'
        },
        {
            KeyCode: 67,
            id: "Closed-HH",
            src: closedHH,
            btn: 'C'
        }
    ];

    const [powerOn, setPowerOn] = useState(false);
    const [bankOn, setBankOn] = useState(false);
    const [volume, setVolume] = useState(0); // État pour le volume
    const [isDragging, setIsDragging] = useState(false); // État pour savoir si on est en train de glisser
    const [display, setDisplay] = useState('');

    // Références pour les audio
    const audioRefs = useRef([]);
    const audio2Refs = useRef([])

    useEffect(() => {
        audioRefs.current = audioRefs.current.slice(0, audio.length); // Ajuster la taille du tableau
        audio2Refs.current = audioRefs.current.slice(0, audio2.length); // Ajuster la taille du tableau
    }, [audio, audio2]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            const keyCode = e.keyCode;
            const audioIndex = audio.findIndex(a => a.KeyCode === keyCode);
            if (audioIndex !== -1) {
                playSound(audioIndex);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [powerOn, audio]);

    function power() {
        setPowerOn(prevPowerOn => !prevPowerOn);
    }

    function bank() {
        if (powerOn) {
            setBankOn(prevBank => !prevBank);
        }
    }

    // Fonction pour jouer le son
    const playSound = (index) => {
        if (powerOn) {
            if(!bankOn){
                audioRefs.current[index].currentTime = 0; // Revenir au début
                audioRefs.current[index].play(); // Jouer le son
                setDisplay(audio[index].id); // Mettre à jour l'affichage
            }else{
                audio2Refs.current[index].currentTime = 0; // Revenir au début
                audio2Refs.current[index].play(); // Jouer le son
                setDisplay(audio2[index].id); // Mettre à jour l'affichage
            }
           
        }
    };

    // Fonction pour mettre à jour la position de la barre de volume
    const updateVolume = (e) => {
        if (powerOn) {
            const volumeBar = e.currentTarget;
            const { left, width } = volumeBar.getBoundingClientRect();
            const clickPosition = e.clientX - left; // Position du clic par rapport à la barre
            const newVolume = Math.min(Math.max(clickPosition / width, 0), 1); // Normaliser entre 0 et 1
            setVolume(newVolume);
            if(!bankOn){
                audioRefs.current.forEach(audio => {
                    audio.volume = newVolume; // Mettre à jour le volume de chaque audio
                });
            }else{
                audio2Refs.current.forEach(audio => {
                    audio.volume = newVolume; // Mettre à jour le volume de chaque audio
                });
            }
           
           
        }
    };

    // Fonction pour gérer le clic sur la barre de volume
    const handleVolumeClick = (e) => {
        if (powerOn) {
            updateVolume(e);
            setDisplay("Volume: " + Math.floor(volume * 100));
        }
    };

    // Fonction pour gérer le début du glissement
    const handleMouseDown = (e) => {
        if (powerOn) {
            setIsDragging(true);
            updateVolume(e);
        }
    };

    // Fonction pour gérer le glissement
    const handleMouseMove = (e) => {
        if (isDragging) {
            updateVolume(e);
            setDisplay("Volume: " + Math.floor(volume * 100));
        }
    };

    // Fonction pour gérer la fin du glissement
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const defaultAudioElement = audio.map((elmt, index) => {
        return (
            <button className='drum-pad' key={index} onClick={() => playSound(index)} id={elmt.id}>
                {elmt.btn}
                <audio ref={el => audioRefs.current[index] = el} src={elmt.src} className='clip' id={elmt.btn}></audio>
            </button>
        );
    });

    const audioElement = audio2.map((elmt, index) => {
        return (
            <button className='drum-pad' key={index} onClick={() => playSound(index)} id={elmt.id}>
                {elmt.btn}
                <audio ref={el => audioRefs.current[index] = el} src={elmt.url} className='clip' id={elmt.btn}></audio>
            </button>
        );
    });

    return (
        <div id='drum-machine'>
            <img className='logo' src={logo} alt='logo' />
            <div className='drum-machine__content'>
                <div className='drum-machine__button'>
                    {!bankOn ? defaultAudioElement : audioElement}
                </div>
                <div className='drum-machine__options'>
                    <div className='power__button'>
                        Power
                        <div className={!powerOn ? "pwb" : "pwbend"} onClick={power}>
                            <div className='pwbtntoggle'></div>
                        </div>
                    </div>
                    <p id='display'>{display}</p>
                    <div className='volume'
                        onClick={handleVolumeClick}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}>
                        <div className='volume_button'></div>
                        <div className='volume_change' style={{ left: `${volume * 100}%` }}></div>
                    </div>
                    <div className='changeSound'>
                        Bank
                        <div className={!bankOn ? "bank_button" : "bank_button-end"} onClick={bank}>
                            <div className='bank_toggle'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
