
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

function createFollow(fields) {
  fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
  fetch(`/api/follows?personaId=${fields.personaId}`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}