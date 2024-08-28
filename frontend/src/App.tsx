import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { backend } from 'declarations/backend';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [raceId, setRaceId] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<Array<{ id: string; time: bigint }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const result = await backend.getLeaderboard();
      setLeaderboard(result);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const startRace = async () => {
    try {
      const id = await backend.startRace();
      setRaceId(id);
      setStartTime(Date.now());
      setGameState('playing');
      initGame();
    } catch (error) {
      console.error('Error starting race:', error);
    }
  };

  const endRace = async () => {
    if (raceId && startTime) {
      const endTime = Date.now();
      setEndTime(endTime);
      const raceTime = endTime - startTime;
      try {
        await backend.endRace(raceId, BigInt(raceTime));
        setGameState('finished');
        fetchLeaderboard();
      } catch (error) {
        console.error('Error ending race:', error);
      }
    }
  };

  const initGame = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Initialize game graphics here
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Add more game initialization logic
      }
    }
  };

  const leaderboardData = {
    labels: leaderboard.map((entry) => entry.id),
    datasets: [
      {
        label: 'Race Time (ms)',
        data: leaderboard.map((entry) => Number(entry.time)),
        backgroundColor: '#2196F3',
      },
    ],
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          2D Kart Racer
        </Typography>
        {gameState === 'idle' && (
          <Button variant="contained" onClick={startRace}>
            Start Race
          </Button>
        )}
        {gameState === 'playing' && (
          <>
            <canvas ref={canvasRef} width={600} height={400} />
            <Button variant="contained" onClick={endRace} sx={{ mt: 2 }}>
              Finish Race
            </Button>
          </>
        )}
        {gameState === 'finished' && endTime && startTime && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            Race Time: {endTime - startTime} ms
          </Typography>
        )}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Leaderboard
          </Typography>
          <Bar data={leaderboardData} />
        </Box>
      </Box>
    </Container>
  );
};

export default App;
