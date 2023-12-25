import networkx
from math import prod

with open('inputs/25.txt') as f:
  components = {comp: con.split(' ') for (comp, con) in [l.strip().split(': ') for l in f.readlines()]}
  comps = list(components.keys())
  for comp in comps:
    connections = components[comp]
    for con in connections:
      if con not in components:
        components[con] = [comp]
      elif comp not in components[con]:
        components[con].append(comp)

  graph = networkx.Graph(components)

  edge_cut = networkx.minimum_edge_cut(graph)
  graph.remove_edges_from(edge_cut)
  res = prod(map(len, networkx.connected_components(graph)))

  print(res)
