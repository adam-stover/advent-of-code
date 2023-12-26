import numpy as np

def intersection(lines):
  Ap = lines[0]['pos']
  Bp = lines[1]['pos']
  Cp = lines[2]['pos']
  Ad = lines[0]['vel']
  Bd = lines[1]['vel']
  Cd = lines[2]['vel']

  A = np.array([
    [Ad['y'] - Bd['y'], Bd['x'] - Ad['x'], 0, Bp['y'] - Ap['y'], Ap['x'] - Bp['x'], 0],
    [Ad['y'] - Cd['y'], Cd['x'] - Ad['x'], 0, Cp['y'] - Ap['y'], Ap['x'] - Cp['x'], 0],
    [Bd['z'] - Ad['z'], 0, Ad['x'] - Bd['x'], Ap['z'] - Bp['z'], 0, Bp['x'] - Ap['x']],
    [Cd['z'] - Ad['z'], 0, Ad['x'] - Cd['x'], Ap['z'] - Cp['z'], 0, Cp['x'] - Ap['x']],
    [0, Ad['z'] - Bd['z'], Bd['y'] - Ad['y'], 0, Bp['z'] - Ap['z'], Ap['y'] - Bp['y']],
    [0, Ad['z'] - Cd['z'], Cd['y'] - Ad['y'], 0, Cp['z'] - Ap['z'], Ap['y'] - Cp['y']],
  ])

  # Create the right-hand side vector b
  b = np.array([
    Bp['y'] * Bd['x'] - Bp['x'] * Bd['y'] - (Ap['y'] * Ad['x'] - Ap['x'] * Ad['y']),
    Cp['y'] * Cd['x'] - Cp['x'] * Cd['y'] - (Ap['y'] * Ad['x'] - Ap['x'] * Ad['y']),
    Bp['x'] * Bd['z'] - Bp['z'] * Bd['x'] - (Ap['x'] * Ad['z'] - Ap['z'] * Ad['x']),
    Cp['x'] * Cd['z'] - Cp['z'] * Cd['x'] - (Ap['x'] * Ad['z'] - Ap['z'] * Ad['x']),
    Bp['z'] * Bd['y'] - Bp['y'] * Bd['z'] - (Ap['z'] * Ad['y'] - Ap['y'] * Ad['z']),
    Cp['z'] * Cd['y'] - Cp['y'] * Cd['z'] - (Ap['z'] * Ad['y'] - Ap['y'] * Ad['z']),
  ])

  # Solve the system of equations using np.linalg.solve
  x = np.linalg.solve(A, b)

  return x

with open('inputs/24.txt') as f:
  hailstones = []
  for line in f.readlines():
    point, direction = line.strip().split(' @ ')
    nums = [*[int(p) for p in point.split(', ')], *[int(d) for d in direction.split(', ')]]
    pos = { 'x': nums[0], 'y': nums[1], 'z': nums[2] }
    vel = { 'x': nums[3], 'y': nums[4], 'z': nums[5] }
    hailstones.append({ 'pos': pos, 'vel': vel })

res = intersection(hailstones)
print(res)
print(sum(res[:3].tolist()))


# Px*Ady-Py*Adx + A0y*Adx-A0x*Ady + A0x*Qy-A0y*Qx = Px*Bdy-Py*Bdx + B0y*Bdx-B0x*Bdy + (B0x*Qy-B0y*Qx)
# A0y*Adx-A0x*Ady = B0y*Bdx-B0x*Bdy
# 1 (1+2): Px(Ady - Bdy) - Py(Adx - Bdx) - Qx(A0y - B0y) + Qy(A0x - B0x) = B0y*Bdx - B0x*Bdy - (A0y*Adx - A0x*Ady)
# 2 (1+3): Px(Ady - Cdy) - Py(Adx - Cdx) - Qx(A0y - C0y) + Qy(A0x - C0x) = C0y*Cdx - C0x*Cdy - (A0y*Adx - A0x*Ady)
# 3 (4+5): [Avx - Bvx]Pz - [Avz - Bvz]Px - [A0x - B0x]Qz + [A0z - B0z]Qx = (B0x * Bvz - B0z * Bvx) - (A0x * Avz - A0z * Avx)
# 4 (4+6): Px(Ady - Bdy) - Py(Adx - Bdx) - Qx(A0y - B0y) + Qy(A0x - B0x) = B0y*Bdx - B0x*Bdy - (A0y*Adx - A0x*Ady)
# 5 (7+8): Px(Ady - Bdy) - Py(Adx - Bdx) - Qx(A0y - B0y) + Qy(A0x - B0x) = B0y*Bdx - B0x*Bdy - (A0y*Adx - A0x*Ady)
# 6 (7+9): Px(Ady - Bdy) - Py(Adx - Bdx) - Qx(A0y - B0y) + Qy(A0x - B0x) = B0y*Bdx - B0x*Bdy - (A0y*Adx - A0x*Ady)
