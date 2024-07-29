"use client";
import { useState, useEffect } from 'react';
import { db } from '@/app/Config/firebase';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import styles from './playerComparison.module.css';
import RadarChartAttack from '@/app/Components/chartradialAttack';
import RadarChartDefense from '@/app/Components/chartradialDefense';
import RadarChartPasses from '@/app/Components/chartradialPasses';
import Flag from 'react-world-flags';

// Keep the existing interfaces (Player, Passes, Attack, Defense)

const countryNameToCode = {
    Colombia: 'COL',
    Uruguay: 'URY',
    Venezuela: 'VEN',
    Argentina: 'ARG',
    Panama: 'PAN',
};

export default function PlayerComparison() {
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [player1Id, setPlayer1Id] = useState<string>('');
    const [player2Id, setPlayer2Id] = useState<string>('');
    const [player1Data, setPlayer1Data] = useState<Player | null>(null);
    const [player2Data, setPlayer2Data] = useState<Player | null>(null);
    const [player1Stats, setPlayer1Stats] = useState<{ passes: Passes | null, attack: Attack | null, defense: Defense | null }>({ passes: null, attack: null, defense: null });
    const [player2Stats, setPlayer2Stats] = useState<{ passes: Passes | null, attack: Attack | null, defense: Defense | null }>({ passes: null, attack: null, defense: null });

    useEffect(() => {
        const fetchAllPlayers = async () => {
            const playerSnapshot = await getDocs(collection(db, 'player'));
            const players = playerSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data() as Player
            }));
            setAllPlayers(players);
        };

        fetchAllPlayers();
    }, []);

    useEffect(() => {
        const fetchPlayerData = async () => {
            if (!player1Id && !player2Id) return;

            const statsSnapshot = await getDocs(collection(db, 'attack'));
            const stats = statsSnapshot.docs.map((doc) => ({
                id: doc.id,
                passes: doc.data() as Passes,
                attack: doc.data() as Attack,
                defense: doc.data() as Defense,
            }));

            if (player1Id) {
                const player1 = allPlayers.find(p => p.id === player1Id);
                setPlayer1Data(player1 || null);
                const player1Stats = stats.find(s => s.id === player1Id);
                setPlayer1Stats({
                    passes: player1Stats?.passes || null,
                    attack: player1Stats?.attack || null,
                    defense: player1Stats?.defense || null,
                });
            }

            if (player2Id) {
                const player2 = allPlayers.find(p => p.id === player2Id);
                setPlayer2Data(player2 || null);
                const player2Stats = stats.find(s => s.id === player2Id);
                setPlayer2Stats({
                    passes: player2Stats?.passes || null,
                    attack: player2Stats?.attack || null,
                    defense: player2Stats?.defense || null,
                });
            }
        };

        fetchPlayerData();
    }, [player1Id, player2Id, allPlayers]);

    const renderPlayerInfo = (player: Player | null, stats: { passes: Passes | null, attack: Attack | null, defense: Defense | null }) => {
        if (!player) return <p>Select a player</p>;

        const countryCode = countryNameToCode[player.country] || 'N/A';

        return (
            <div className={styles.playerColumn}>
                <div className={styles.playerInfo}>
                    <p className={styles.playerText}>
                        <Flag style={{ height: '28px', margin: '0' }} code={countryCode} /> {player.country}
                    </p>
                    <p className={styles.playerName}>{player.player_nickname}</p>
                    <p className={styles.playerText}>{player.position}</p>
                </div>
                <img className={styles.playerImg} src={player.img} alt={player.player_name} />
                <div className={styles.statsOverview}>
                    <h2 className={styles.statsHeader}>Overview Stats</h2>
                    <table className={styles.statsTable}>
                        <tbody>
                            <tr>
                                <td>Appearances</td>
                                <td>6</td>
                            </tr>
                            <tr>
                                <td>Goals</td>
                                <td>{stats.attack?.Standard_Gls || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Assists</td>
                                <td>{stats.passes?.Ast || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Wins</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Losses</td>
                                <td>1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.charts}>
                    <div className={styles.chart}>
                        <h2>Attack Stats</h2>
                        <RadarChartAttack dataS={[stats.attack]} />
                    </div>
                    <div className={styles.chart}>
                        <h2>Passes Stats</h2>
                        <RadarChartPasses dataA={[stats.passes]} />
                    </div>
                    <div className={styles.chart}>
                        <h2>Defense Stats</h2>
                        <RadarChartDefense dataD={[stats.defense]} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.comparisonContainer}>
            <div className={styles.dropdownContainer}>
                <select 
                    value={player1Id} 
                    onChange={(e) => setPlayer1Id(e.target.value)}
                    className={styles.playerDropdown}
                >
                    <option value="">Select Player 1</option>
                    {allPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                            {player.player_name}
                        </option>
                    ))}
                </select>
                <select 
                    value={player2Id} 
                    onChange={(e) => setPlayer2Id(e.target.value)}
                    className={styles.playerDropdown}
                >
                    <option value="">Select Player 2</option>
                    {allPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                            {player.player_name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.playerComparisonContent}>
                {renderPlayerInfo(player1Data, player1Stats)}
                {renderPlayerInfo(player2Data, player2Stats)}
            </div>
        </div>
    );
}