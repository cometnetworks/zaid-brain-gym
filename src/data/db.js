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
    // Animales
    { word: 'GATO', icon: 'cat' }, { word: 'PERRO', icon: 'dog' }, { word: 'LEON', icon: 'lion' },
    { word: 'PATO', icon: 'duck' }, { word: 'TIGRE', icon: 'tiger' }, { word: 'RATON', icon: 'mouse' },
    { word: 'PEZ', icon: 'fish' }, { word: 'AVE', icon: 'bird' }, { word: 'CERDO', icon: 'pig' },
    { word: 'RANA', icon: 'frog' }, { word: 'OSO', icon: 'bear' }, { word: 'LOBO', icon: 'wolf' },

    // Naturaleza
    { word: 'SOL', icon: 'sun' }, { word: 'LUNA', icon: 'moon' }, { word: 'MAR', icon: 'sea' },
    { word: 'ARBOL', icon: 'tree' }, { word: 'FLOR', icon: 'flower' }, { word: 'AGUA', icon: 'water' },
    { word: 'FUEGO', icon: 'fire' }, { word: 'NUBE', icon: 'cloud' }, { word: 'RIO', icon: 'river' },

    // Objetos y Comida
    { word: 'PAN', icon: 'bread' }, { word: 'CASA', icon: 'house' }, { word: 'LIBRO', icon: 'book' },
    { word: 'MESA', icon: 'table' }, { word: 'LAPIZ', icon: 'pencil' }, { word: 'TREN', icon: 'train' },
    { word: 'AUTO', icon: 'car' }, { word: 'BARCO', icon: 'ship' }, { word: 'MANZANA', icon: 'apple' },
    { word: 'LECHE', icon: 'milk' }, { word: 'PASTEL', icon: 'cake' }, { word: 'PELOTA', icon: 'ball' },
    { word: 'SOMBRERO', icon: 'hat' }, { word: 'SILLA', icon: 'chair' }, { word: 'CAMA', icon: 'bed' }
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

// --- LAYOUTS DE CRUCIGRAMA (Nivel 1 y 2) ---
// --- LAYOUTS DE CRUCIGRAMA (Nivel 1 y 2) ---
export const CROSSWORD_LAYOUTS = [
    {
        id: 1,
        width: 6, height: 6,
        words: [
            // GATO (Horiz) y AUTO (Vert). Cruce en 'A'.
            // GATO: (0,1), (1,1), (2,1), (3,1). A está en (1,1).
            // AUTO: (1,1), (1,2), (1,3), (1,4). A está en (1,1).
            { id: 1, text: "GATO", direction: "H", x: 0, y: 1, clue: "El _____ dice miau" },
            { id: 2, text: "AUTO", direction: "V", x: 1, y: 1, clue: "Voy a la escuela en _____" },
            // SOL (Horiz). Ahora cruza con la O final de AUTO.
            // AUTO termina en O en (1,4).
            // SOL: (0,4), (1,4), (2,4). La O está en (1,4).
            { id: 3, text: "SOL", direction: "H", x: 0, y: 4, clue: "El _____ es amarillo y caliente" }
        ]
    },
    {
        id: 2,
        width: 7, height: 7,
        words: [
            // PATO (H) en (0,0). P-A-T-O.
            // TREN (V) en (2,0). T-R-E-N. Cruce en T.
            // PATO: (0,0),(1,0),(2,0),(3,0). T es (2,0).
            // TREN: (2,0),(2,1),(2,2),(2,3). T es (2,0).
            { id: 1, text: "PATO", direction: "H", x: 0, y: 0, clue: "El _____ nada en el lago" },
            { id: 2, text: "TREN", direction: "V", x: 2, y: 0, clue: "El _____ corre por las vías" },
            // NUBE (H). Cruce con la N de TREN.
            // TREN termina en N en (2,3).
            // NUBE: (2,3),(3,3),(4,3),(5,3). N es (2,3).
            { id: 3, text: "NUBE", direction: "H", x: 2, y: 3, clue: "La _____ está en el cielo y llueve" }
        ]
    },
    {
        id: 3,
        width: 7, height: 7,
        words: [
            // MESA (H). M-E-S-A.
            // SAL (V). S-A-L. Cruce en S.
            // MESA: (0,2),(1,2),(2,2),(3,2). S es (2,2).
            // SAL: (2,2),(2,3),(2,4). S es (2,2).
            { id: 1, text: "MESA", direction: "H", x: 0, y: 2, clue: "Comemos sobre la _____" },
            { id: 2, text: "SAL", direction: "V", x: 2, y: 2, clue: "La _____ es blanca y salada" },
            // LUNA (H). Cruce con L de SAL.
            // SAL termina en L en (2,4).
            // LUNA: (2,4),(3,4),(4,4),(5,4). L es (2,4).
            { id: 3, text: "LUNA", direction: "H", x: 2, y: 4, clue: "La _____ sale de noche" }
        ]
    },
    {
        id: 4,
        width: 8, height: 8,
        words: [
            // CASA (H) en (0,0). C-A-S-A.
            // ARBOL (V) cruza en A (1,0). A-R-B-O-L.
            { id: 1, text: "CASA", direction: "H", x: 0, y: 0, clue: "Vivo en una _____" },
            { id: 2, text: "ARBOL", direction: "V", x: 1, y: 0, clue: "El _____ tiene hojas verdes" },
            // LOBO (H) cruza en O de ARBOL (1,3).
            // ARBOL: A(1,0), R(1,1), B(1,2), O(1,3), L(1,4).
            // LOBO (0,3): L(0,3), O(1,3), B(2,3), O(3,3).
            { id: 3, text: "LOBO", direction: "H", x: 0, y: 3, clue: "El _____ aúlla a la luna" }
        ]
    }
];
