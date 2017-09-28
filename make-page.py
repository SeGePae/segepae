import markdown
from glob import glob

config = open('static/config.rc').read().split('\n')
template = open('static/template.html').read()
footer = open('static/footer.html').read()


files = {}
for line in config:
    if line.strip():
        files[line] = '<div class="base">'+ markdown.markdown(open('static/'+line+'.md',
            ).read(), extensions=['markdown.extensions.tables']
) + '</div>'+ footer

out = template.format(**files)
print(out)
with open('website/index.html', 'w') as f:
    f.write(out)
