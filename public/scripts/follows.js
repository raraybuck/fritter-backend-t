function viewAllFollows(fields) {
    fetch('/api/follows')
      .then(showResponse)
      .catch(showResponse);
}

function viewFollowingByPersonaId(fields) {
    fetch(`/api/follows/${fields.personaId}`)
      .then(showResponse)
      .catch(showResponse);
  }