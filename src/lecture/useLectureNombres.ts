import { useState } from 'react';
import { useFrameOutput } from 'react-native-vision-camera';
import {
  useTextRecognition,
  type TextRecognitionOptions,
} from 'react-native-vision-camera-ocr-plus';
import { createSynchronizable, scheduleOnRN } from 'react-native-worklets';

import { extraireNombres, resumeNombres, type NombreLu, type ResultatTexte } from './nombres';

/**
 * Options de reconnaissance, définies une seule fois : useTextRecognition recrée
 * le moteur à chaque nouvel objet d'options.
 * Une image sur 5 est analysée pour ménager la batterie.
 */
const OPTIONS_LECTURE: TextRecognitionOptions = {
  language: 'latin',
  frameSkipThreshold: 5,
};

/**
 * Branche la reconnaissance de texte sur la caméra et renvoie les nombres visibles.
 * Les images sont analysées en mémoire puis libérées aussitôt : rien n'est enregistré.
 * Renvoie la sortie à passer à <Camera outputs={[...]} /> et les derniers nombres lus.
 */
export function useLectureNombres() {
  const [nombres, setNombres] = useState<NombreLu[]>([]);
  const { scanText } = useTextRecognition(OPTIONS_LECTURE);

  const sortie = useFrameOutput({
    pixelFormat: 'rgb', // exigé sur Android par la reconnaissance de texte
    onFrame: (frame) => {
      'worklet';
      try {
        const lus = extraireNombres(scanText(frame) as unknown as ResultatTexte);
        // scanText renvoie le dernier résultat connu à chaque image :
        // on ne prévient l'écran que si la lecture a changé.
        const resume = resumeNombres(lus);
        if (resume !== dernierResume.getDirty()) {
          dernierResume.setBlocking(resume);
          scheduleOnRN(setNombres, lus);
        }
      } finally {
        frame.dispose();
      }
    },
  });

  return { sortie, nombres };
}

/**
 * Dernière lecture envoyée à l'écran. Un objet ordinaire serait copié (et figé) dans
 * le worklet : un « synchronizable » reste modifiable d'une image à l'autre.
 */
const dernierResume = createSynchronizable<string>('');
