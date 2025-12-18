// ==========================================
// BASES DE DATOS
// ==========================================

export const STORY_DB = [
    { title: "El Perro Pepe", text: "Pepe es un perro feliz. Juega con su pelota roja en el parque.", q: "¿De qué color es la pelota?", a: "ROJA", opts: ["ROJA", "AZUL"] },
    { title: "La Rana Juana", text: "Juana es una rana verde. A ella le gusta saltar en el agua fría.", q: "¿Qué le gusta a Juana?", a: "SALTAR", opts: ["SALTAR", "CORRER"] },
    { title: "El Gato Miau", text: "Miau come pescado. Duerme mucho en su cama suave y azul.", q: "¿Qué come Miau?", a: "PESCADO", opts: ["PESCADO", "POLLO"] },
    { title: "El Sol Solecito", text: "El sol sale por la mañana. Nos da calor y luz amarilla.", q: "¿Cuándo sale el sol?", a: "MAÑANA", opts: ["MAÑANA", "NOCHE"] },
    { title: "La Osa Rosa", text: "Rosa es una osa grande. Le gusta comer miel dulce del bosque.", q: "¿Qué come Rosa?", a: "MIEL", opts: ["MIEL", "PAN"] },
    // New Stories
    { title: "El Tigre Toño", text: "Toño es un tigre fuerte con rayas negras. Le gusta correr muy rápido por la selva.", q: "¿Cómo corre Toño?", a: "RÁPIDO", opts: ["RÁPIDO", "LENTO"] },
    { title: "La Luna Lulú", text: "Lulú sale de noche. Es blanca y brilla en el cielo oscuro junto a las estrellas.", q: "¿Cuándo sale Lulú?", a: "NOCHE", opts: ["NOCHE", "DÍA"] },
    { title: "El Pato Paco", text: "Paco nada en el lago azul. Tiene plumas amarillas y dice cuac cuac.", q: "¿De qué color son sus plumas?", a: "AMARILLAS", opts: ["AMARILLAS", "VERDES"] },
    { title: "La Vaca Lola", text: "Lola vive en la granja. Nos da leche fresca y come pasto verde.", q: "¿Qué nos da Lola?", a: "LECHE", opts: ["LECHE", "JUGUETE"] },
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
    { word: 'GATO', icon: 'cat', clue: 'El _____ dice miau' },
    { word: 'PERRO', icon: 'dog', clue: 'El _____ es el mejor amigo del hombre' },
    { word: 'LEON', icon: 'lion', clue: 'El _____ es el rey de la selva' },
    { word: 'PATO', icon: 'duck', clue: 'El _____ dice cuac cuac' },
    { word: 'TIGRE', icon: 'tiger', clue: 'El _____ tiene rayas negras y naranjas' },
    { word: 'RATON', icon: 'mouse', clue: 'El _____ come queso y huye del gato' },
    { word: 'PEZ', icon: 'fish', clue: 'El _____ nada en el agua' },
    { word: 'AVE', icon: 'bird', clue: 'El _____ vuela por el cielo' },
    { word: 'CERDO', icon: 'pig', clue: 'El _____ vive en la granja y es rosado' },
    { word: 'RANA', icon: 'frog', clue: 'La _____ salta y come moscas' },
    { word: 'OSO', icon: 'bear', clue: 'El _____ duerme todo el invierno' },
    { word: 'LOBO', icon: 'wolf', clue: 'El _____ aúlla a la luna llena' },
    { word: 'VACA', icon: 'cow', clue: 'La _____ nos da leche y dice muuu' },
    { word: 'CONEJO', icon: 'rabbit', clue: 'El _____ salta y come zanahorias' },
    { word: 'MONO', icon: 'monkey', clue: 'El _____ come bananas y trepa árboles' },
    { word: 'CABALLO', icon: 'horse', clue: 'El _____ galopa muy rápido' },
    { word: 'ELEFANTE', icon: 'elephant', clue: 'El _____ tiene una trompa larga' },
    { word: 'JIRAFA', icon: 'giraffe', clue: 'La _____ tiene el cuello muy largo' },
    { word: 'TORTUGA', icon: 'turtle', clue: 'La _____ lleva su casa en la espalda' },

    // Naturaleza
    { word: 'SOL', icon: 'sun', clue: 'El _____ nos da luz y calor' },
    { word: 'LUNA', icon: 'moon', clue: 'La _____ sale por la noche' },
    { word: 'MAR', icon: 'sea', clue: 'El _____ es azul y tiene olas' },
    { word: 'ARBOL', icon: 'tree', clue: 'El _____ tiene tronco y hojas' },
    { word: 'FLOR', icon: 'flower', clue: 'La _____ huele rico y tiene pétalos' },
    { word: 'AGUA', icon: 'water', clue: 'Bebo _____ cuando tengo sed' },
    { word: 'FUEGO', icon: 'fire', clue: 'El _____ es caliente y quema' },
    { word: 'NUBE', icon: 'cloud', clue: 'La _____ es blanca y está en el cielo' },
    { word: 'RIO', icon: 'river', clue: 'El _____ lleva agua hasta el mar' },
    { word: 'NIEVE', icon: 'snow', clue: 'La _____ es blanca y muy fría' },
    { word: 'ESTRELLA', icon: 'star', clue: 'La _____ brilla en la noche' },

    // Objetos y Comida
    { word: 'PAN', icon: 'bread', clue: 'Como _____ tostado en el desayuno' },
    { word: 'CASA', icon: 'house', clue: 'Vivo en una _____ con mi familia' },
    { word: 'LIBRO', icon: 'book', clue: 'Leo un _____ antes de dormir' },
    { word: 'PLATO', icon: 'table', clue: 'Sirvo la comida en el _____' }, // "table" icon mapped to Dinner Plate in ModernAsset
    { word: 'LAPIZ', icon: 'pencil', clue: 'Escribo y dibujo con mi _____' },
    { word: 'TREN', icon: 'train', clue: 'El _____ viaja por las vías' },
    { word: 'AUTO', icon: 'car', clue: 'Voy a la escuela en el _____' },
    { word: 'BARCO', icon: 'ship', clue: 'El _____ navega por el mar' },
    { word: 'MANZANA', icon: 'apple', clue: 'La _____ es una fruta roja y dulce' },
    { word: 'LECHE', icon: 'milk', clue: 'La vaca nos da _____ blanca' },
    { word: 'PASTEL', icon: 'cake', clue: 'Comemos _____ en mi cumpleaños' },
    { word: 'PELOTA', icon: 'ball', clue: 'Juego fútbol con una _____' },
    { word: 'SOMBRERO', icon: 'hat', clue: 'Me pongo el _____ en la cabeza' },
    { word: 'SILLA', icon: 'chair', clue: 'Me siento en la _____' },
    { word: 'CAMA', icon: 'bed', clue: 'Duermo en mi _____ toda la noche' },
    { word: 'QUESO', icon: 'cheese', clue: 'El ratón come _____' },
    { word: 'HUEVO', icon: 'egg', clue: 'La gallina pone un _____' },
    { word: 'UVA', icon: 'grape', clue: 'La _____ es una fruta pequeña y morada' },
    { word: 'RELOJ', icon: 'clock', clue: 'El _____ marca la hora' },
    { word: 'LLAVE', icon: 'key', clue: 'Abro la puerta con la _____' },
    { word: 'TELEFONO', icon: 'phone', clue: 'Hablo con mi abuela por _____' },
    { word: 'REGALO', icon: 'gift', clue: 'Recibo un _____ en Navidad' },
    { word: 'PIZZA', icon: 'pizza', clue: 'Me gusta comer _____' },
    { word: 'HELADO', icon: 'icecream', clue: 'El _____ es frío y dulce' },

    // Colores
    { word: 'ROJO', icon: 'red', clue: 'La manzana es de color _____' },
    { word: 'AZUL', icon: 'blue', clue: 'El cielo es de color _____' },
    { word: 'VERDE', icon: 'green', clue: 'El pasto es de color _____' },
    { word: 'AMARILLO', icon: 'yellow', clue: 'El sol es de color _____' },
    { word: 'BLANCO', icon: 'white', clue: 'La nieve es de color _____' },
    { word: 'NEGRO', icon: 'black', clue: 'El carbón es de color _____' },

    // Ropa
    { word: 'CAMISA', icon: 'shirt', clue: 'Me pongo la _____ para vestir' },
    { word: 'ZAPATO', icon: 'shoe', clue: 'Me pongo el _____ en el pie' },
    { word: 'VESTIDO', icon: 'dress', clue: 'La niña usa un _____ bonito' },
    { word: 'PANTALON', icon: 'pants', clue: 'Uso _____ largos en invierno' },
    { word: 'DADO', icon: 'dice', clue: 'Lanzo el _____ para jugar' },
];

// --- DICCIONARIO INGLÉS AMPLIADO ---
export const WORD_DB_EN = [
    { word: 'SUN', icon: 'sun', clue: 'The _____ is hot and yellow' },
    { word: 'CAT', icon: 'cat', clue: 'The _____ says meow' },
    { word: 'DOG', icon: 'dog', clue: 'The _____ barks woof woof' },
    { word: 'CAR', icon: 'car', clue: 'I drive a _____' },
    { word: 'RED', icon: 'red', clue: 'The apple is _____' },
    { word: 'BLUE', icon: 'blue', clue: 'The sky is _____' },
    { word: 'BOOK', icon: 'book', clue: 'I read a _____ covering a story' },
    { word: 'TREE', icon: 'tree', clue: 'The _____ has green leaves' },
    { word: 'FISH', icon: 'fish', clue: 'The _____ swims in the water' },
    { word: 'BIRD', icon: 'bird', clue: 'The _____ flies in the sky' },
    { word: 'MILK', icon: 'milk', clue: 'Cows give us white _____' },
    { word: 'STAR', icon: 'star', clue: 'Twinkle twinkle little _____' },
    { word: 'LION', icon: 'lion', clue: 'The _____ roars loud' },
    { word: 'PIG', icon: 'pig', clue: 'The _____ lives on a farm and is pink' },
    { word: 'HAT', icon: 'hat', clue: 'I wear a _____ on my head' },
    { word: 'BALL', icon: 'ball', clue: 'I kick the soccer _____' },
    { word: 'CAKE', icon: 'cake', clue: 'Happy Birthday! Let\'s eat _____' },
    { word: 'FROG', icon: 'frog', clue: 'The _____ is green and jumps' },
    { word: 'SHIP', icon: 'ship', clue: 'The _____ sails on the ocean' },
    { word: 'MOON', icon: 'moon', clue: 'The _____ comes out at night' },
    { word: 'DUCK', icon: 'duck', clue: 'The _____ says quack quack' },
    { word: 'COW', icon: 'cow', clue: 'The _____ says moo' },
    { word: 'RABBIT', icon: 'rabbit', clue: 'The _____ has long ears and hops' },
    { word: 'MONKEY', icon: 'monkey', clue: 'The _____ climbs trees' },
    { word: 'HORSE', icon: 'horse', clue: 'The _____ runs fast' },
    { word: 'EGG', icon: 'egg', clue: 'The chicken lays an _____' },
    { word: 'CHEESE', icon: 'cheese', clue: 'Mice love to eat _____' },
    { word: 'APPLE', icon: 'apple', clue: 'A red _____ a day keeps the doctor away' },
    { word: 'GREEN', icon: 'green', clue: 'Grass is _____' },
    { word: 'YELLOW', icon: 'yellow', clue: 'The sun is _____' },
    { word: 'SHIRT', icon: 'shirt', clue: 'I wear a _____ on my body' },
    { word: 'SHOE', icon: 'shoe', clue: 'I wear a _____ on my foot' },
    { word: 'DRESS', icon: 'dress', clue: 'She wears a pretty _____' },
    { word: 'PANTS', icon: 'pants', clue: 'I wear _____ on my legs' },
    { word: 'TABLE', icon: 'table', clue: 'I put plates on the _____' },
    { word: 'CHAIR', icon: 'chair', clue: 'I sit on the _____' },
    { word: 'BED', icon: 'bed', clue: 'I sleep in my _____' },
    { word: 'HOUSE', icon: 'house', clue: 'I live in a _____' },
    { word: 'WATER', icon: 'water', clue: 'I drink _____' },
    { word: 'FIRE', icon: 'fire', clue: '_____ is hot' },
    { word: 'CLOUD', icon: 'cloud', clue: '_____ is in the sky' },
    { word: 'CLOCK', icon: 'clock', clue: 'Tick tock goes the _____' },
    { word: 'KEY', icon: 'key', clue: 'Open the door with a _____' },
    { word: 'PHONE', icon: 'phone', clue: 'Call mom on the _____' },
    { word: 'PIZZA', icon: 'pizza', clue: 'I love pepperoni _____' },
    { word: 'ICE CREAM', icon: 'icecream', clue: 'Cold and sweet _____' },
];

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
