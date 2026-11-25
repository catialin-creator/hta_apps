/**
 * Extraction des nombres lus par la reconnaissance de texte (tâche 2.1).
 * Fonctions pures, exécutées dans le frame processor (« worklet ») : elles ne gardent
 * que des nombres et leurs positions, jamais l'image.
 */

/** Sous-ensemble du résultat ML Kit utilisé ici (types de react-native-vision-camera-ocr-plus). */
export interface CadreTexte {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResultatTexte {
  blocks: {
    lines: {
      lineText: string;
      lineFrame: CadreTexte;
      elements: { elementText: string; elementFrame: CadreTexte }[];
    }[];
  }[];
}

/** Un nombre entier visible à l'écran du tensiomètre, avec sa position dans l'image. */
export interface NombreLu {
  valeur: number;
  /** Coin haut gauche et taille du mot qui contient le nombre, en pixels de l'image. */
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
}

/** Au plus 3 chiffres : aucune valeur de tension ou de pouls n'en a plus. */
const MAX_CHIFFRES = 3;

function nombresDuTexte(texte: string, cadre: CadreTexte, resultat: NombreLu[]): void {
  'worklet';
  const morceaux = texte.match(/\d+/g);
  if (morceaux == null) return;
  for (const morceau of morceaux) {
    if (morceau.length > MAX_CHIFFRES) continue;
    resultat.push({
      valeur: parseInt(morceau, 10),
      x: cadre.x,
      y: cadre.y,
      largeur: cadre.width,
      hauteur: cadre.height,
    });
  }
}

/**
 * Renvoie tous les nombres entiers de 1 à 3 chiffres lus dans l'image.
 * Utilise les mots (éléments) de chaque ligne pour une position précise ;
 * à défaut (mode allégé Android), la ligne entière.
 */
export function extraireNombres(texte: ResultatTexte): NombreLu[] {
  'worklet';
  const resultat: NombreLu[] = [];
  for (const bloc of texte.blocks) {
    for (const ligne of bloc.lines) {
      if (ligne.elements.length > 0) {
        for (const element of ligne.elements) {
          nombresDuTexte(element.elementText, element.elementFrame, resultat);
        }
      } else {
        nombresDuTexte(ligne.lineText, ligne.lineFrame, resultat);
      }
    }
  }
  return resultat;
}

/** Résumé compact (« 120 80 72 ») pour ne prévenir l'écran que quand la lecture change. */
export function resumeNombres(nombres: NombreLu[]): string {
  'worklet';
  return nombres.map((n) => n.valeur).join(' ');
}
