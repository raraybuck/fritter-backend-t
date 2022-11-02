

function createPersona(fields) {
    fetch('/api/persona', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

// the info passed to body is essentially everything in fields, but the persona id is a necessary
// part of the URL as well, hence fields.id
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

//   function deletePersonaByHandle(fields) {
//     fetch(`/api/persona`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
//       .then(showResponse)
//       .catch(showResponse);
//   }

   // specifically only the signed in user's personas
  function viewUserPersonas(fields) {
    fetch('/api/persona')
      .then(showResponse)
      .catch(showResponse);
  }
  
  // need to be careful with this one... could expoes other users' data/personas
  function viewPersonasByUser(fields) {
    fetch(`/api/persona?username=${fields.username}`)
      .then(showResponse)
      .catch(showResponse);
  }