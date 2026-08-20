import { describe, it, expect } from 'vitest';
import { AlignmentEngine, BooleanOperationsEngine } from '../../src/spatial';

describe('AlignmentEngine', () => {
  const items = [
    { id: '1', x: 10, y: 20, width: 50, height: 40 },
    { id: '2', x: 100, y: 50, width: 60, height: 80 },
    { id: '3', x: 200, y: 10, width: 40, height: 30 },
  ];

  it('aligns items to the left', () => {
    const aligned = AlignmentEngine.align(items, 'align-left');
    expect(aligned.every((i) => i.x === 10)).toBe(true);
  });

  it('aligns items to the top', () => {
    const aligned = AlignmentEngine.align(items, 'align-top');
    expect(aligned.every((i) => i.y === 10)).toBe(true);
  });

  it('distributes items horizontally', () => {
    const distributed = AlignmentEngine.distribute(items, 'distribute-horizontal');
    expect(distributed.length).toBe(3);
    expect(distributed[0].x).toBe(10);
  });

  it('finds nearest magnetic anchor point', () => {
    const anchor = AlignmentEngine.findNearestAnchor({ x: 35, y: 21 }, items, 15);
    expect(anchor).not.toBeNull();
    expect(anchor?.position).toBe('top');
  });
});

describe('BooleanOperationsEngine', () => {
  const shapeA = { id: 'a', x: 0, y: 0, width: 100, height: 100 };
  const shapeB = { id: 'b', x: 50, y: 50, width: 100, height: 100 };

  it('executes union operation', () => {
    const result = BooleanOperationsEngine.execute(shapeA, shapeB, 'union');
    expect(result.bounds).toEqual({ x: 0, y: 0, width: 150, height: 150 });
    expect(result.fillRule).toBe('nonzero');
  });

  it('executes intersect operation', () => {
    const result = BooleanOperationsEngine.execute(shapeA, shapeB, 'intersect');
    expect(result.bounds).toEqual({ x: 50, y: 50, width: 50, height: 50 });
  });

  it('executes exclude operation', () => {
    const result = BooleanOperationsEngine.execute(shapeA, shapeB, 'exclude');
    expect(result.fillRule).toBe('evenodd');
  });
});
