import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useAtomStore, ELEMENTS, PART_INFO, MISSIONS } from './store';
import './App.css';

// --- PROCEDURAL GEIGER COUNTER AUDIO ---
function useGeigerCounter(isRadioactive) {
  const audioCtx = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRadioactive) {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();

      const playClick = () => {
        if (!audioCtx.current) return;
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150 + Math.random() * 500, audioCtx.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.05);

        gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.current.destination);
        osc.start();
        osc.stop(audioCtx.current.currentTime + 0.05);
      };

      intervalRef.current = setInterval(playClick, Math.random() * 150 + 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRadioactive]);
}

function NucleusParticle({ data, isUnstable }) {
  const ref = useRef();
  const driftVector = useMemo(() => {
    return new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ).normalize().multiplyScalar(Math.random() * 0.5 + 0.2);
  }, []);

  useFrame((state, delta) => {
    const isPaused = useAtomStore.getState().selectedPart !== null;
    if (isPaused || !ref.current) return;

    if (isUnstable) {
      ref.current.position.x += (Math.random() - 0.5) * 0.05;
      ref.current.position.y += (Math.random() - 0.5) * 0.05;
      ref.current.position.z += (Math.random() - 0.5) * 0.05;
      ref.current.position.addScaledVector(driftVector, delta * 0.3);
    } else {
      const target = new THREE.Vector3(...data.basePos);
      ref.current.position.lerp(target, 0.1);
    }
  });

  return (
    <mesh
      ref={ref}
      position={data.basePos}
      onPointerOver={(e) => { e.stopPropagation(); useAtomStore.getState().setSelectedPart(data.type); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={data.type === 'proton' ? '#ef4444' : '#94a3b8'}
        emissive={data.type === 'proton' ? '#ef4444' : '#475569'}
        emissiveIntensity={isUnstable ? Math.random() * 3 : 1.5}
        roughness={0.2}
      />
    </mesh>
  );
}

function Nucleus({ protons, neutrons }) {
  const { setSelectedPart, feedback } = useAtomStore();
  const isUnstable = feedback?.type === 'warning';

  const particles = useMemo(() => {
    const items = [];
    const total = protons + neutrons;
    const radius = Math.max(0.4, Math.cbrt(total) * 0.25);
    const phi = Math.PI * (3 - Math.sqrt(5));

    let types = Array(protons).fill('proton').concat(Array(neutrons).fill('neutron'));
    types.sort(() => Math.random() - 0.5);

    for (let i = 0; i < total; i++) {
      const y = 1 - (i / (total - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      items.push({
        type: types[i],
        basePos: [Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]
      });
    }
    return items;
  }, [protons, neutrons]);

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setSelectedPart('nucleus'); }}
      onPointerOut={() => setSelectedPart(null)}
    >
      {particles.map((p, i) => (
        <NucleusParticle key={i} data={p} isUnstable={isUnstable} />
      ))}
    </group>
  );
}

function ElectronCloud({ shells }) {
  const groupRef = useRef();
  const localTime = useRef(0);
  const { modifyElectrons } = useAtomStore();

  const stableShells = useMemo(() => {
    return shells.map((electronCount, shellIndex) => ({
      electronCount,
      radius: 1.5 + (shellIndex * 1),
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      speed: 2 - (shellIndex * 0.3)
    }));
  }, [shells]);

  useFrame((state, delta) => {
    const isPaused = useAtomStore.getState().selectedPart !== null;
    if (!isPaused && groupRef.current) {
      localTime.current += delta;
      groupRef.current.rotation.x = localTime.current * 0.1;
      groupRef.current.rotation.y = localTime.current * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {stableShells.map((shell, shellIndex) => (
        <group key={shellIndex} rotation={shell.rotation}>
          <mesh
            onClick={(e) => { e.stopPropagation(); modifyElectrons(1); }}
            /* THE FIX: Hovering the ring now triggers the pause state! */
            onPointerOver={(e) => {
              e.stopPropagation();
              useAtomStore.getState().setSelectedPart('electron');
              document.body.style.cursor = 'copy';
            }}
            onPointerOut={() => {
              useAtomStore.getState().setSelectedPart(null);
              document.body.style.cursor = 'auto';
            }}
          >
            {/* UPGRADE: Thickened the ring from 0.04 to 0.08 to make the mouse hover hitbox much larger, but lowered opacity so it still looks elegant */}
            <torusGeometry args={[shell.radius, 0.08, 16, 64]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
          </mesh>

          {Array.from({ length: shell.electronCount }).map((_, eIndex) => (
            <Electron
              key={eIndex}
              radius={shell.radius}
              offset={(eIndex / shell.electronCount) * Math.PI * 2}
              speed={shell.speed}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function Electron({ radius, offset, speed }) {
  const ref = useRef();
  const localTime = useRef(0);
  const { modifyElectrons } = useAtomStore();

  useFrame((state, delta) => {
    const isPaused = useAtomStore.getState().selectedPart !== null;
    if (!isPaused) localTime.current += delta;

    const t = (localTime.current * speed) + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t) * radius;
  });

  return (
    <mesh
      ref={ref}
      onClick={(e) => { e.stopPropagation(); modifyElectrons(-1); document.body.style.cursor = 'auto'; }}
      onPointerOver={(e) => { e.stopPropagation(); useAtomStore.getState().setSelectedPart('electron'); document.body.style.cursor = 'no-drop'; }}
      onPointerOut={() => { useAtomStore.getState().setSelectedPart(null); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={4} />
    </mesh>
  );
}

function Configurator() {
  const { setCustomElement, isCustom, feedback, currentElement } = useAtomStore();

  // Initialize state with the current atom's actual values
  const [p, setP] = useState(currentElement.protons);
  const [n, setN] = useState(currentElement.neutrons);
  const [e, setE] = useState(currentElement.electrons.join(','));

  useGeigerCounter(feedback?.type === 'warning');

  // THE FIX: This forces the text boxes to instantly update if you click a mission or delete an electron in 3D!
  useEffect(() => {
    setP(currentElement.protons);
    setN(currentElement.neutrons);
    setE(currentElement.electrons.join(','));
  }, [currentElement]);

  const handleBuild = () => {
    // Converts the string "2,4" back into an array [2, 4]
    const shellArray = e.toString().split(',').map(num => parseInt(num.trim()) || 0).filter(num => num > 0);
    setCustomElement(p, n, shellArray);
  };

  return (
    <div className={`configurator ${isCustom ? 'active-border' : ''}`}>
      <h3>Build Custom Isotope</h3>
      <div className="input-group">
        <label>Protons (Element identity)</label>
        <input type="number" min="0" value={p} onChange={e => setP(parseInt(e.target.value) || 0)} />
      </div>
      <div className="input-group">
        <label>Neutrons (Mass & Stability)</label>
        <input type="number" min="0" value={n} onChange={e => setN(parseInt(e.target.value) || 0)} />
      </div>
      <div className="input-group">
        <label>Electrons (Charge)</label>
        <input type="text" value={e} onChange={e => setE(e.target.value)} placeholder="e.g. 2,8,1" />
      </div>
      <button onClick={handleBuild}>Generate Atom</button>

      {feedback && (
        <div className={`feedback-panel ${feedback.type}`}>
          <div className="feedback-header">
            <span className="feedback-symbol">{currentElement.symbol}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>{feedback.isotopeName}</h3>
              <h4>{feedback.title}</h4>
            </div>
          </div>
          <p>{feedback.message}</p>

          {feedback.desc && (
            <div className="element-facts">
              <div className="fact-item"><strong>About:</strong> {feedback.desc}</div>
              <div className="fact-item"><strong>Fun Fact:</strong> {feedback.fact}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MissionBoard() {
  const { activeMission, setActiveMission, missionSuccess } = useAtomStore();

  if (!activeMission) {
    return (
      <div className="mission-board selection">
        <h3>Select a Mission</h3>
        {MISSIONS.map(m => (
          <button key={m.id} onClick={() => setActiveMission(m.id)}>{m.title}</button>
        ))}
      </div>
    );
  }

  return (
    <div className={`mission-board active-mission ${missionSuccess ? 'success' : ''}`}>
      <div className="mission-header">
        <h3>MISSION: {activeMission.title}</h3>
        <button className="close-btn" onClick={() => setActiveMission(null)}>Abort</button>
      </div>
      <p>{activeMission.prompt}</p>

      {missionSuccess && (
        <div className="mission-win">
          <h4>MISSION ACCOMPLISHED</h4>
          <p>You perfectly balanced the atom!</p>
          <button
            style={{ marginTop: '12px', width: '100%', padding: '8px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setActiveMission(null)}
          >
            Next Mission
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { currentElement, setElement, selectedPart, setSelectedPart, isCustom } = useAtomStore();

  return (
    <div className="app-container" onClick={() => setSelectedPart(null)}>

      <header className="top-nav">
        <div className="logo">IbtikarZ Subatomic</div>
        <div className="element-selector">
          {Object.entries(ELEMENTS).map(([key, el]) => (
            <button
              key={key}
              className={currentElement.id === el.id && !isCustom ? 'active' : ''}
              onClick={(e) => { e.stopPropagation(); setElement(key); }}
            >
              <span className="symbol">{el.symbol}</span> {el.name}
            </button>
          ))}
        </div>
      </header>

      <MissionBoard />
      <Configurator />

      <div className={`info-panel ${selectedPart ? 'visible' : ''}`}>
        {selectedPart ? (
          <>
            <h2 style={{ color: PART_INFO[selectedPart].color }}>{PART_INFO[selectedPart].title}</h2>
            <p>{PART_INFO[selectedPart].desc}</p>
          </>
        ) : (
          <p className="hint-text">Hover over the nucleus, a proton, or an electron to inspect.</p>
        )}
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        <Nucleus protons={currentElement.protons} neutrons={currentElement.neutrons} />
        <ElectronCloud shells={currentElement.electrons} />

        <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={20} />

        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}