from bibtex import BibTex
import json

bib = BibTex('')
jsn = {}
html = ''
def write_bibtex(entry):
    if entry['ENTRYTYPE'] == 'booklet':
        entry['ENTRYTYPE'] = 'collection'
        
    out = '@'+entry['ENTRYTYPE']+'{'+entry['ID']+',\n'
    keys = []
    for k in entry:
        if k not in ['ID', 'ENTRYTYPE']:
            keys += ['    '+k+' = {'+entry[k]+'}']
    out += ',\n'.join(keys)+'\n}'
    return out

for key in bib:
    jsn[key] = {}
    jsn[key]['html'] = bib.format(key, template='html')
    jsn[key]['bibtex'] = write_bibtex(bib.bdb.entries_dict[key])
    jsn[key]['author'] = bib[key]['author_str'] or bib[key]['editor_str']
    jsn[key]['data'] = bib[key]
    jsn[key]['year'] = bib[key]['year']
    jsn[key]['keyword'] = bib[key]['keyword'].split(' // ')
    jsn[key]['freetext'] = ' '.join(list(bib[key].values())).lower()
    print(bib[key]['keyword'])
jsn['ACTIVE'] = {
        'author': [],
        'year': [],
        'keyword': [],
        'freetext': []}

with open('data.js', 'w') as f:
    f.write('var BIB = '+json.dumps(jsn, indent=2)+';\n')
