export function fillBodyUpdate(candidate, body) {
  Object.keys(body)
    .forEach( candidateKey => {
      candidate[candidateKey] = body[candidateKey];
    });

    return candidate;
}