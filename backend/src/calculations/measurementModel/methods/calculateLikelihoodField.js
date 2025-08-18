const calculateLikelihoodField = (accurate, simulation, params) => {
  const { sigma_hit } = params;

  const d = Math.abs(simulation.distance - accurate.distance);
  const p = Math.exp(- (d * d) / (2 * sigma_hit * sigma_hit));

  return p * 100; 
};

module.exports = { calculateLikelihoodField };
