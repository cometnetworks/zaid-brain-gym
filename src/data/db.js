// ==========================================
// BASES DE DATOS
// ==========================================

export const STORY_DB = [
    { title: "El Perro Pepe", text: "Pepe es un perro feliz. Juega con su pelota roja en el parque.", q: "¿De qué color es la pelota?", a: "ROJA", opts: ["ROJA", "AZUL"] },
    { title: "La Rana Juana", text: "Juana es una rana verde. A ella le gusta saltar en el agua fría.", q: "¿Qué le gusta a Juana?", a: "SALTAR", opts: ["SALTAR", "CORRER"] },
    { title: "El Gato Miau", text: "Miau come pescado. Duerme mucho en su cama suave y azul.", q: "¿Qué come Miau?", a: "PESCADO", opts: ["PESCADO", "POLLO"] },
    { title: "El Sol Solecito", text: "El sol sale por la mañana. Nos da calor y luz amarilla.", q: "¿Cuándo sale el sol?", a: "MAÑANA", opts: ["MAÑANA", "NOCHE"] },
    { title: "La Osa Rosa", text: "Rosa es una osa grande. Le gusta comer miel dulce del bosque.", q: "¿Qué come Rosa?", a: "MIEL", opts: ["MIEL", "PAN"] },
];

export const PHYS_DB = [
    "Construye una torre de 10 objetos sin que se caiga.",
    "Da 5 saltos de rana y luego mantén el equilibrio en un pie.",
    "Camina como cangrejo de un lado a otro de la habitación.",
    "Haz una bolita de papel y encéstala en un bote de basura lejos.",
    "Trae 3 objetos de color ROJO lo más rápido posible.",
    "Gatea por debajo de una mesa sin tocar las patas.",
];

// --- DICCIONARIO ESPAÑOL AMPLIADO ---
export const WORD_DB_ES = [
    { word: 'SOL', icon: 'sun' }, { word: 'PAN', icon: 'bread' }, { word: 'MAR', icon: 'sea' },
    { word: 'GATO', icon: 'cat' }, { word: 'PATO', icon: 'duck' }, { word: 'LUNA', icon: 'moon' },
    { word: 'CASA', icon: 'house' }, { word: 'PERRO', icon: 'dog' }, { word: 'LIBRO', icon: 'book' },
    { word: 'ARBOL', icon: 'tree' }, { word: 'FLOR', icon: 'flower' }, { word: 'MESA', icon: 'table' },
    { word: 'LAPIZ', icon: 'pencil' }, { word: 'TREN', icon: 'train' }, { word: 'LEON', icon: 'lion' },
    { word: 'TIGRE', icon: 'tiger' }, { word: 'RATON', icon: 'mouse' }, { word: 'MANZANA', icon: 'apple' },
    { word: 'AGUA', icon: 'water' }, { word: 'FUEGO', icon: 'fire' }, { word: 'NUBE', icon: 'cloud' }
];

// --- DICCIONARIO INGLÉS AMPLIADO ---
export const WORD_DB_EN = [
    { word: 'SUN', icon: 'sun' }, { word: 'CAT', icon: 'cat' }, { word: 'DOG', icon: 'dog' },
    { word: 'CAR', icon: 'car' }, { word: 'RED', icon: 'red' }, { word: 'BLUE', icon: 'blue' },
    { word: 'BOOK', icon: 'book' }, { word: 'TREE', icon: 'tree' }, { word: 'FISH', icon: 'fish' },
    { word: 'BIRD', icon: 'bird' }, { word: 'MILK', icon: 'milk' }, { word: 'STAR', icon: 'star' },
    { word: 'LION', icon: 'lion' }, { word: 'PIG', icon: 'pig' }, { word: 'HAT', icon: 'hat' },
    { word: 'BALL', icon: 'ball' }, { word: 'CAKE', icon: 'cake' }, { word: 'FROG', icon: 'frog' },
    { word: 'SHIP', icon: 'ship' }, { word: 'MOON', icon: 'moon' }, { word: 'DUCK', icon: 'duck' }
];
