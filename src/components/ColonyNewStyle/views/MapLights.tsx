import { LightInRoom } from '../types/Colony';

// Mapa de luces por room ID
export const LIGHTS_BY_ROOM: Record<number, LightInRoom[]> = {
  // BARRACK
  1: [
    {
      id: 3,
      top: 20,
      left: 32,
      width: 17.4,
      height: 30.4,
      type: 'torch',
    },
  ],

  // CONTROL ROOM
  2: [
    {
      id: 1,
      top: 30,
      left: 80,
      width: 17,
      height: 36,
      type: 'torch',
    },
    {
      id: 12,
      top: 80,
      left: 13,
      width: 15.5,
      height: 24.5,
      type: 'bonfire',
    },
  ],

  // LIVING QUARTER
  3: [
    {
      id: 2,
      top: 34,
      left: 66,
      width: 16,
      height: 32,
      type: 'torch',
    },
  ],

  // WORKSHOP
  4: [
    {
      id: 13,
      top: 54,
      left: 70,
      width: 16.5,
      height: 25.5,
      type: 'bonfire',
    },
  ],

  // WAREHOUSE
  5: [
    {
      id: 10,
      top: 36,
      left: 21,
      width: 25.7,
      height: 46.7,
      type: 'torch',
    },
  ],

  // HOSPITAL
  6: [
    {
      id: 9,
      top: 30,
      left: 38,
      width: 21,
      height: 43,
      type: 'torch',
    },
  ],

  // TAVERN
  8: [
    {
      id: 4,
      top: 41,
      left: 9,
      width: 15,
      height: 23,
      type: 'torch',
    },
    {
      id: 5,
      top: 41,
      left: 71,
      width: 15,
      height: 22,
      type: 'torch',
    },
  ],

  // COLLECTION
  7: [
    {
      id: 6,
      top: 67,
      left: 39,
      width: 15,
      height: 30,
      type: 'torch',
    },
    {
      id: 7,
      top: 67,
      left: 62,
      width: 15,
      height: 30,
      type: 'torch',
    },
  ],

  // SELLER - Solo cuando está activo
  9: [
    {
      id: 8,
      top: 39,
      left: 12.5,
      width: 26,
      height: 38,
      type: 'torch',
    },
  ],

  // EXPEDITION (id: 10)
  10: [
    {
      id: 11,
      top: 28,
      left: 42,
      width: 8,
      height: 38,
      type: 'torch',
    },
  ],
};

// Componente para renderizar las luces de una room específica
interface RoomLightsProps {
  roomId: number;
  isVisible?: boolean; // Para controlar visibilidad (ej: seller)
  mobile?: boolean;
}

export function RoomLights({ roomId, mobile, isVisible = true }: RoomLightsProps) {
  if (!isVisible) return null;

  let lights = LIGHTS_BY_ROOM[roomId] || [];
  if (mobile && roomId === 10) {
    lights = [
      {
        id: 11,
        top: 28,
        left: 45.5,
        width: 8,
        height: 36.5,
        type: 'torch',
      },
    ];
  }

  return (
    <>
      {lights.map((light) => (
        <div
          key={`light-${light.id}`}
          className={light.type === 'torch' ? 'torch-glow' : 'bonfire-flame'}
          style={{
            top: `${light.top}%`,
            left: `${light.left}%`,
            width: `${light.width}%`,
            height: `${light.height}%`,
          }}
        />
      ))}
    </>
  );
}
