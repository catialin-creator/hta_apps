import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

/** Nom du fichier de base, stocké uniquement sur le téléphone. */
const NOM_BASE = 'tension.db';

/** Entrée du trousseau sécurisé (Keychain iOS / Keystore Android) qui garde la clé. */
const CLE_TROUSSEAU = 'tension_cle_base';

/** Longueur de la clé aléatoire, en octets (256 bits). */
const TAILLE_CLE_OCTETS = 32;

let baseOuverte: Promise<SQLite.SQLiteDatabase> | null = null;

function enHexadecimal(octets: Uint8Array): string {
  return Array.from(octets, (o) => o.toString(16).padStart(2, '0')).join('');
}

/**
 * Lit la clé de chiffrement dans le trousseau, ou la crée au premier lancement.
 * La clé ne quitte jamais le téléphone.
 */
async function obtenirCle(): Promise<string> {
  const existante = await SecureStore.getItemAsync(CLE_TROUSSEAU);
  if (existante) {
    return existante;
  }
  const nouvelle = enHexadecimal(Crypto.getRandomBytes(TAILLE_CLE_OCTETS));
  await SecureStore.setItemAsync(CLE_TROUSSEAU, nouvelle, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return nouvelle;
}

async function ouvrir(): Promise<SQLite.SQLiteDatabase> {
  const cle = await obtenirCle();
  const base = await SQLite.openDatabaseAsync(NOM_BASE);
  // La clé doit être appliquée avant toute autre requête (SQLCipher).
  // Format x'…' : clé brute de 256 bits, sans dérivation par mot de passe.
  await base.execAsync(`PRAGMA key = "x'${cle}'";`);
  // Vérifie que la base est lisible avec cette clé (échoue sinon).
  await base.getFirstAsync('SELECT count(*) FROM sqlite_master;');
  return base;
}

/**
 * Renvoie la connexion à la base chiffrée, ouverte une seule fois.
 * Fonctionne entièrement hors connexion.
 */
export function obtenirBase(): Promise<SQLite.SQLiteDatabase> {
  if (!baseOuverte) {
    baseOuverte = ouvrir().catch((erreur) => {
      baseOuverte = null;
      throw erreur;
    });
  }
  return baseOuverte;
}
