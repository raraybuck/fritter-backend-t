
function viewFollowsByPersonaId(fields) {
    fetch(`/api/follows?personaId=${fields.personaId}`)
      .then(showResponse)
      .catch(showResponse);
  }

function viewAllFollows(field) {
    fetch('api/follows')
      .then(showResponse)
      .catch(showResponse);
  }

function viewAllFollowing(fields) {
    fetch('/api/follows/following')
      .then(showResponse)
      .catch(showResponse);
}

function viewAllFollowers(fields) {
    fetch('/api/follows/followers')
      .then(showResponse)
      .catch(showResponse);
}