const table = document.querySelector('results-table');

class RedirectsForm extends HTMLElement {
    connectedCallback() {
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', e => this.submit(e));
    }

    async submit(e) {
        e.preventDefault();
        const newDomain = this.querySelector('#new-url').value.trim();
        const urls = this.querySelector('#links').value.split('\n');
        const redirects = urls.map(url => {  return { oldURL: url.trim(), testURL: newDomain + url.trim() }; });

        try {
            const response = await fetch('/urls', { 
                method: 'POST',
                body: JSON.stringify(redirects),
                headers: { 'Content-Type': 'application/json' }
            });
            if(response.ok) {
                const json = await response.json();
                console.log(json);
            }
        } catch {
            alert('Error checking urls');
        }
        table.content = redirects;
    }
}
customElements.define('redirects-form', RedirectsForm);

class ResultsTable extends HTMLElement {
    connectedCallback() {
        this.tbody = this.querySelector('tbody');
    }

    set content(content) {
        console.log(content)
        this.reset();
        content.forEach(row => this.addRow(row));
    }

    async addRow(promise) {
        const details = await promise;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${details.old}</td><td>${details.new}</td>`;
        this.tbody.appendChild(tr);
    }

    reset() {
        this.tbody.querySelectorAll('tr').forEach(tr => tr.remove());
    }

}
customElements.define('results-table', ResultsTable);