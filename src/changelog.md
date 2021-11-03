---
layout: layouts/page.njk
---

## Changelog

Original source found [here](https://github.com/bikebrigade/dispatch/blob/main/CHANGELOG.md).

<div class="changelog" id="changelog"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.4.1/markdown-it.min.js"></script>

<script>
  const md = window.markdownit();

  fetch('https://raw.githubusercontent.com/bikebrigade/dispatch/main/CHANGELOG.md', {
  })
  .then(response => {
    return response.text()
  })
  .then((result) => {
    document.getElementById('changelog').innerHTML = md.render(result);
  })
</script>