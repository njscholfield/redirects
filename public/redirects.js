const table = document.querySelector('results-table');
const form = document.querySelector('redirects-form');

class RedirectsForm extends HTMLElement {
    connectedCallback() {
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', e => this.submit(e));
    }

    get externalDomain() {
        return this.querySelector('#external-domain').value.trim();
    }

    async submit(e) {
        e.preventDefault();
        const newDomain = this.querySelector('#new-url').value.trim();
        const urls = this.querySelector('#links').value.trim().split('\n');
        const redirects = urls.map(url => {  return { oldURL: url.trim(), testURL: newDomain + url.trim() }; });

        try {
            const response = await fetch('/urls', { 
                method: 'POST',
                body: JSON.stringify(redirects),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if(response.ok) {
                const json = await response.json();
                table.content = json;
            }
        } catch {
            alert('Error checking urls');
        }
    }
}
customElements.define('redirects-form', RedirectsForm);

class ResultsTable extends HTMLElement {
    connectedCallback() {
        this.tbody = this.querySelector('tbody');
        this.querySelector('#btn-copy-urls').addEventListener('click', e => this.copyNewURLs(e));
    }

    set content(content) {
        this.reset();
        content.forEach(row => this.addRow(row));
    }

    async addRow(promise) {
        const details = await promise;
        const tr = document.createElement('tr');
        let newURL = '';
        if(details.valid) {
            newURL = (form.externalDomain) ? form.externalDomain + details.oldURL : 'SAME';
        }
        tr.innerHTML = `<td class="old-url">${details.oldURL}</td><td class="new-url">${newURL}</td>`;
        this.tbody.appendChild(tr);
    }

    copyNewURLs(e) {
        const btn = e.currentTarget;
        const rows = [...this.tbody.querySelectorAll('tr')];
        const newURLs = rows.reduce((str, row) => { return str + row.querySelector('.new-url').textContent + '\n'; }, '');
        navigator.clipboard.writeText(newURLs)
            .then(() => {
                btn.textContent = 'Copied!';
                setTimeout(() => { document.querySelector('#btn-copy-urls').textContent = 'Copy'; }, 2000);
            });
    }

    reset() {
        this.tbody.querySelectorAll('tr').forEach(tr => tr.remove());
    }

}
customElements.define('results-table', ResultsTable);