const apiUrl = '/api/students';
let allStudents = [];

async function fetchStudents() {
  const res = await fetch(apiUrl);
  allStudents = await res.json();
  applyFilters();
}

function displayStudents(students) {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No students found</td></tr>`;
    return;
  }

  students.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.gender}</td>
      <td>${student.gmail}</td>
      <td>${student.program}</td>
      <td>${student.year}</td>
      <td>${student.university}</td>
      <td><button class="btn-delete" onclick="deleteStudent('${student.id}')">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newStudent = {
    id: document.getElementById("id").value.trim(),
    name: document.getElementById("name").value.trim(),
    gender: document.getElementById("gender").value,
    gmail: document.getElementById("gmail").value.trim(),
    program: document.getElementById("program").value.trim(),
    year: parseInt(document.getElementById("year").value),
    university: document.getElementById("university").value.trim()
  };

  if (isNaN(newStudent.year)) {
    alert("Year level must be a number!");
    return;
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudent)
  });

  const msg = await res.json();
  alert(msg.message);
  fetchStudents();
  e.target.reset();
});

async function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;
  const res = await fetch(`${apiUrl}?id=${id}`, { method: "DELETE" });
  const msg = await res.json();
  alert(msg.message);
  fetchStudents();
}

function applyFilters() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const genderFilter = document.getElementById("genderFilter").value;

  let filtered = allStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery) ||
    s.program.toLowerCase().includes(searchQuery)
  );

  if (genderFilter !== "all") {
    filtered = filtered.filter(s => s.gender === genderFilter);
  }

  displayStudents(filtered);
}

document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("genderFilter").addEventListener("change", applyFilters);

fetchStudents();
