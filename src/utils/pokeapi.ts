import fetch from 'node-fetch';

export async function obtenerSprite(nombre: string): Promise<string | null> {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        if (!response.ok) return null;

        const data = await response.json() as {
            sprites: {
                front_default: string;
            };
        };

        return data.sprites.front_default;
    } catch (error) {
        console.error(`Error obteniendo sprite para ${nombre}:`, error);
        return null;
    }
}
