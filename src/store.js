import { create } from 'zustand';

export const ELEMENTS = {
    hydrogen: { id: 'hydrogen', name: 'Hydrogen', symbol: 'H', protons: 1, neutrons: 0, electrons: [1] },
    helium: { id: 'helium', name: 'Helium', symbol: 'He', protons: 2, neutrons: 2, electrons: [2] },
    carbon: { id: 'carbon', name: 'Carbon', symbol: 'C', protons: 6, neutrons: 6, electrons: [2, 4] },
    oxygen: { id: 'oxygen', name: 'Oxygen', symbol: 'O', protons: 8, neutrons: 8, electrons: [2, 6] },
    gold: { id: 'gold', name: 'Gold', symbol: 'Au', protons: 79, neutrons: 118, electrons: [2, 8, 18, 32, 18, 1] }
};

const PERIODIC_TABLE = [];
PERIODIC_TABLE[1] = { name: 'Hydrogen', symbol: 'H', stableN: [0, 1], desc: 'The lightest and most abundant element in the universe.', fact: 'It makes up about 75% of all normal matter!' };
PERIODIC_TABLE[2] = { name: 'Helium', symbol: 'He', stableN: [1, 2], desc: 'A colorless, odorless, non-toxic noble gas.', fact: 'Helium is so light that Earth\'s gravity can\'t hold it.' };
PERIODIC_TABLE[3] = { name: 'Lithium', symbol: 'Li', stableN: [3, 4], desc: 'A soft, silvery-white alkali metal.', fact: 'It is the lightest metal and floats on water.' };
PERIODIC_TABLE[4] = { name: 'Beryllium', symbol: 'Be', stableN: [5], desc: 'A rare element used in aerospace.', fact: 'The James Webb Telescope uses Beryllium mirrors.' };
PERIODIC_TABLE[5] = { name: 'Boron', symbol: 'B', stableN: [5, 6], desc: 'A metalloid used in fiberglass.', fact: 'When burned, it produces a bright green flame!' };
PERIODIC_TABLE[6] = { name: 'Carbon', symbol: 'C', stableN: [6, 7], desc: 'The building block of all known life.', fact: 'Diamonds and pencil lead are both 100% carbon.' };
PERIODIC_TABLE[7] = { name: 'Nitrogen', symbol: 'N', stableN: [7, 8], desc: 'A common nonmetal gas.', fact: 'It makes up 78% of the air you breathe.' };
PERIODIC_TABLE[8] = { name: 'Oxygen', symbol: 'O', stableN: [8, 9, 10], desc: 'Highly reactive nonmetal.', fact: 'Liquid oxygen is pale blue and magnetic.' };
PERIODIC_TABLE[9] = { name: 'Fluorine', symbol: 'F', stableN: [10], desc: 'The most reactive element.', fact: 'It is so reactive it will burn glass and sand!' };
PERIODIC_TABLE[10] = { name: 'Neon', symbol: 'Ne', stableN: [10, 11, 12], desc: 'A noble gas known for glowing.', fact: 'Only red-orange neon signs actually contain pure neon.' };
PERIODIC_TABLE[11] = { name: 'Sodium', symbol: 'Na', stableN: [12], desc: 'A highly reactive alkali metal.', fact: 'If you drop pure sodium in water, it explodes.' };
PERIODIC_TABLE[12] = { name: 'Magnesium', symbol: 'Mg', stableN: [12, 13, 14], desc: 'A shiny gray solid.', fact: 'It burns with a blinding white light used in flares.' };
PERIODIC_TABLE[13] = { name: 'Aluminum', symbol: 'Al', stableN: [14], desc: 'A lightweight, silvery metal.', fact: 'It was once considered more valuable than gold.' };
PERIODIC_TABLE[14] = { name: 'Silicon', symbol: 'Si', stableN: [14, 15, 16], desc: 'A hard, brittle crystalline solid.', fact: 'It is the main ingredient in computer microchips.' };
PERIODIC_TABLE[15] = { name: 'Phosphorus', symbol: 'P', stableN: [16], desc: 'A highly reactive nonmetal.', fact: 'White phosphorus glows in the dark when exposed to oxygen.' };
PERIODIC_TABLE[16] = { name: 'Sulfur', symbol: 'S', stableN: [16, 17, 18, 20], desc: 'A bright yellow, brittle solid.', fact: 'It is responsible for the smell of rotten eggs.' };
PERIODIC_TABLE[17] = { name: 'Chlorine', symbol: 'Cl', stableN: [18, 20], desc: 'A yellow-green toxic gas.', fact: 'It was used as a chemical weapon in WWI, but now cleans swimming pools.' };
PERIODIC_TABLE[18] = { name: 'Argon', symbol: 'Ar', stableN: [18, 20, 22], desc: 'An inert noble gas.', fact: 'It is used inside incandescent light bulbs to stop the filament from burning.' };
PERIODIC_TABLE[19] = { name: 'Potassium', symbol: 'K', stableN: [20, 22], desc: 'A soft, silvery-white metal.', fact: 'Bananas are radioactive because they contain Potassium-40!' };
PERIODIC_TABLE[20] = { name: 'Calcium', symbol: 'Ca', stableN: [20, 22, 23, 24, 26, 28], desc: 'An alkaline earth metal.', fact: 'It makes your bones hard, but pure calcium is actually a soft silvery metal.' };

PERIODIC_TABLE[26] = { name: 'Iron', symbol: 'Fe', stableN: [28, 30, 31, 32], desc: 'The most common element on Earth by mass.', fact: 'Earth\'s core is a giant sphere of molten iron.' };
PERIODIC_TABLE[79] = { name: 'Gold', symbol: 'Au', stableN: [118], desc: 'A dense, soft, shiny metal.', fact: 'All the gold ever mined in human history could fit into just three Olympic swimming pools.' };
PERIODIC_TABLE[92] = { name: 'Uranium', symbol: 'U', stableN: [], desc: 'A heavy, radioactive metal.', fact: 'One pellet of uranium the size of a fingertip contains as much energy as 149 gallons of oil. There are no stable isotopes.' };

export const PART_INFO = {
    nucleus: { title: 'Nucleus', desc: 'Contains protons and neutrons. Holds 99.9% of the atom\'s mass.', color: '#a855f7' },
    proton: { title: 'Proton', desc: 'Positively charged (+1). Determines the element\'s atomic number.', color: '#ef4444' },
    neutron: { title: 'Neutron', desc: 'No charge (0). Adds mass and stability to the nucleus.', color: '#64748b' },
    electron: { title: 'Electron', desc: 'Negatively charged (-1). Orbits the nucleus at near light speed.', color: '#38bdf8' }
};

// THE FIX: Added "start" configurations so the engine knows what atom to put on screen when you click a mission!
export const MISSIONS = [
    { id: 1, title: "The Time Keeper", prompt: "Create Carbon-14, the radioactive isotope used to date ancient fossils.", target: { p: 6, n: 8, e: 6 }, start: { p: 6, n: 6, e: [2, 4] } },
    { id: 2, title: "The Battery Ion", prompt: "Build a stable Cation of Lithium with a +1 charge.", target: { p: 3, n: 4, e: 2 }, start: { p: 3, n: 4, e: [2, 1] } },
    { id: 3, title: "Heavy Metal", prompt: "Create the stable isotope of Gold (Au).", target: { p: 79, n: 118, e: 79 }, start: { p: 1, n: 0, e: [1] } }
];

export const useAtomStore = create((set, get) => ({
    currentElement: { id: 'carbon', name: 'Carbon', symbol: 'C', protons: 6, neutrons: 6, electrons: [2, 4] },
    selectedPart: null,
    isCustom: false,
    feedback: { type: 'success', title: 'Stable Isotope', message: 'This atom exists naturally.', desc: PERIODIC_TABLE[6].desc, fact: PERIODIC_TABLE[6].fact, isotopeName: 'Carbon-12' },
    activeMission: null,
    missionSuccess: false,

    setActiveMission: (missionId) => {
        const mission = MISSIONS.find(m => m.id === missionId);
        set({
            activeMission: mission,
            missionSuccess: false,
            isCustom: true
        });

        // THE FIX: Auto-load the starting atom so the student has a baseline to work from!
        if (mission && mission.start) {
            get().setCustomElement(mission.start.p, mission.start.n, mission.start.e);
        }
    },

    setElement: (key) => {
        const el = ELEMENTS[key];
        const data = PERIODIC_TABLE[el.protons];
        set({
            currentElement: el,
            selectedPart: null,
            isCustom: false,
            feedback: {
                type: 'success',
                title: 'Stable Isotope',
                message: 'This atom exists naturally.',
                desc: data.desc,
                fact: data.fact,
                isotopeName: `${data.name}-${el.protons + el.neutrons}`
            }
        });
    },

    setSelectedPart: (part) => set({ selectedPart: part }),

    modifyElectrons: (change) => {
        const state = get();
        let newShells = [...state.currentElement.electrons];

        if (change > 0) {
            if (newShells.length === 0) newShells = [1];
            else newShells[newShells.length - 1] += 1;
        } else {
            if (newShells.length > 0) {
                newShells[newShells.length - 1] -= 1;
                if (newShells[newShells.length - 1] <= 0) newShells.pop();
            }
        }
        state.setCustomElement(state.currentElement.protons, state.currentElement.neutrons, newShells);
    },

    setCustomElement: (p, n, shells) => {
        const totalElectrons = shells.reduce((a, b) => a + b, 0);

        let feedbackObj = {};
        let elementName = 'Unknown';
        let symbol = '?';
        let massNumber = p + n;

        if (p === 0) {
            feedbackObj = { type: 'error', title: 'Physics Error', message: 'An atom must have at least 1 proton to exist.', isotopeName: 'Empty Space' };
        } else if (p > 118) {
            feedbackObj = { type: 'error', title: 'Theoretical', message: 'Elements beyond 118 have not been confirmed.', isotopeName: `Element ${p}-${massNumber}` };
        } else {
            const elementData = PERIODIC_TABLE[p];
            if (elementData) {
                elementName = elementData.name;
                symbol = elementData.symbol;
                const isotopeName = `${elementName}-${massNumber}`;

                if (elementData.stableN.length === 0 || !elementData.stableN.includes(n)) {
                    feedbackObj = {
                        type: 'warning',
                        title: 'Radioactive Decay',
                        isotopeName: isotopeName,
                        message: (!elementData.stableN.length || n < elementData.stableN[0])
                            ? `Unstable Isotope: Not enough neutrons to glue the protons together. The nucleus will tear itself apart.`
                            : `Unstable Isotope: The nucleus is too heavy. It will undergo radioactive decay.`
                    };
                } else if (p !== totalElectrons) {
                    const charge = p - totalElectrons;
                    feedbackObj = {
                        type: 'info',
                        title: `${charge > 0 ? 'Cation' : 'Anion'} (${charge > 0 ? '+' : ''}${charge})`,
                        isotopeName: isotopeName,
                        message: `Protons (${p}) and electrons (${totalElectrons}) are unbalanced. This is an ion.`
                    };
                } else {
                    feedbackObj = {
                        type: 'success',
                        title: 'Stable Isotope',
                        isotopeName: isotopeName,
                        message: 'This atom is perfectly balanced and exists naturally.',
                        desc: elementData.desc,
                        fact: elementData.fact
                    };
                }
            } else {
                elementName = `Element ${p}`;
                symbol = `Uu${p}`;
                feedbackObj = { type: 'info', title: 'Heavy Element', isotopeName: `${elementName}-${massNumber}`, message: 'This element exists, but data is limited in this demo.' };
            }
        }

        const state = get();
        let isSuccess = false;
        if (state.activeMission) {
            const t = state.activeMission.target;
            if (p === t.p && n === t.n && totalElectrons === t.e) {
                isSuccess = true;
            }
        }

        set({
            isCustom: true,
            currentElement: { id: 'custom', name: elementName, symbol: symbol, protons: p, neutrons: n, electrons: shells },
            selectedPart: null,
            feedback: feedbackObj,
            missionSuccess: isSuccess
        });
    }
}));