

function createPersona(fields) {
    fetch('/api/persona', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function updatePersona(fields) {
    fetch(`/api/persona/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function deletePersona(fields) {
    fetch(`/api/persona/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }