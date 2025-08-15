function sampleBeamMeasurement(
    z_star, 
    z_max, 
    sigma_hit, 
    lambda_short,                        
    w_hit, 
    w_short, 
    w_max, 
    w_rand
) {
    // Debug logging
    /*console.log('sampleBeamMeasurement called with:', {
        z_star, z_max, sigma_hit, lambda_short, w_hit, w_short, w_max, w_rand
    });*/

    const r = Math.random();
    if (r < w_hit) {
        let z;
        let attempts = 0;
        const maxAttempts = 1000;
        do {
            z = randomNormal(z_star, sigma_hit);
            attempts++;
            if (attempts > maxAttempts) {
                z = Math.max(0, Math.min(z_max, z_star));
                break;
            }
        } while (z < 0 || z > z_max);
        return z;
    } else if (r < w_hit + w_short) {
        let z;
        let attempts = 0;
        const maxAttempts = 1000;
        do {
            z = randomExponential(lambda_short);
            attempts++;
            if (attempts > maxAttempts) {
                z = Math.random() * z_star;
                break;
            }
        } while (z < 0 || z > z_star);
        return z;
    } else if (r < w_hit + w_short + w_max) {
        return z_max;
    } else {
        return Math.random() * z_max;
    }
}

function randomNormal(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function randomExponential(lambda) {
    return -Math.log(1.0 - Math.random()) / lambda;
}

module.exports = {
    sampleBeamMeasurement
}