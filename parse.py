from lib.bibtex import BibTex
import json
from collections import defaultdict
import networkx as nx

bib = BibTex('data/SeGePae.bib', jfile='data/journals.csv', tfile='data/templates')
jsn = {}
html = ''
categories = nx.DiGraph()
def write_bibtex(entry):
    if entry['ENTRYTYPE'] == 'booklet':
        entry['ENTRYTYPE'] = 'collection'
        
    out = '@'+entry['ENTRYTYPE']+'{'+entry['ID']+',\n'
    keys = []
    for k in entry:
        if k not in ['ID', 'ENTRYTYPE']:
            keys += ['  '+k+' = {'+entry[k]+'}']
    out += ',\n'.join(keys)+'\n}'
    return out

csv = {}
with open('data/SeGePae.csv') as f:
    for line in f:
        tmp = line.split('\t')
        key = tmp[3]
        kat = tmp[7]
        csv[key] = kat

_kw = {'en': {}, 'de': {}}
with open('data/keywords.tsv') as f:
    for line in f:
        tmp = line.split('\t')
        if tmp[3].strip():
            _kw['de'][tmp[0].strip()] = tmp[3].strip()

        if tmp[4].strip():
            _kw['en'][tmp[1].strip()] = tmp[4].strip()

#all_keywords = defaultdict(int)
translator = {}
coocs = defaultdict(lambda : defaultdict(list))
kws = defaultdict(list)
for key in bib:
    jsn[key] = {}
    jsn[key]['author'] = bib[key]['author_str'] or bib[key]['editor_str']
    if not bib[key]['author']:
        bib[key]['author'] = bib[key]['editor']
    jsn[key]['data'] = bib[key]
    jsn[key]['year'] = bib[key]['year']
    jsn[key]['category'] = csv[key].replace('\xa0', ' ')
    for cat in csv[key].split('; '):
        cat = cat.replace('\xa0', ' ')
        num = cat.split(' ')[0]
        numl = num.split('.')
        if len(numl) == 1:
            categories.add_node(num, value=cat)
        else:
            if num not in categories:
                categories.add_node(num, value=cat)
                categories.add_edge('.'.join(num.split('.')[:-1]), num)
        if cat in csv:
            csv[cat] += [key]
        else:
            csv[cat] = [key]
        

    keywords_, keywords, keywordsen = bib[key]['keywords'].split(';'), [], []
    for k in keywords_:
        if ' // ' in k:
            keywords += [k.split(' // ')[0]]
            keywordsen += [k.split(' // ')[1]]
            a, b = k.split(' // ')
            translator[_kw['de'].get(a, a)] = _kw['en'].get(b, b)
        else:
            keywords += [_kw['de'].get(k, k)]
    
    jsn[key]['keyword'] = sorted(set([_kw['de'].get(x, x) for x in keywords]))
    jsn[key]['keywords_en'] = sorted(set([_kw['en'].get(x, x) for x in
        keywordsen]))
    
    for i, k1 in enumerate(keywords):
        for j, k2 in enumerate(keywords):
            if i < j:
                coocs[k1][k2] += [key]
        kws[k1] += [key]

    jsn[key]['freetext'] = ' '.join(list(bib[key].values())).lower()
    jsn[key]['html'] = bib.format(key, template='html')
    if 'abstract' in bib.bdb.entries_dict[key]:
        jsn[key]['abstract'] = bib.bdb.entries_dict[key]['abstract']
        del bib.bdb.entries_dict[key]['abstract']
    

    
    jsn[key]['bibtex'] = write_bibtex(bib.bdb.entries_dict[key])
    print(bib[key]['keyword'])
jsn['ACTIVE'] = {}

jsn['keys'] = [key for key in bib]

with open('website/data.js', 'w') as f:
    f.write('var BIB = '+json.dumps(jsn, indent=2)+';\n')
    f.write('var KAT = '+json.dumps(csv, indent=2)+';\n')
    f.write('var TRAN = '+json.dumps(translator, indent=2)+';\n')
    f.write('var KW = '+json.dumps(kws, indent=2)+';\n')
    f.write('var COOC = '+json.dumps(coocs, indent=2)+';\n')
    #f.write('var CAT = '+json.dumps(categories, indent=2)+';\n')
with open('website/keywords.json', 'w') as f:
    keys = []
    for i, k in enumerate(sorted(kws, key=lambda x: len(kws[x]),
            reverse=True)):
        keys += [{"id": i+1, "name": k, "value": k}]
    f.write(json.dumps(keys))

#with open('data/keywords.tsv', 'w') as f:
#    f.write('KeywordDE\tKeywordEN\tOccurrence\n')
#    for k, fr in sorted(all_keywords.items(), key=lambda x: x[1], reverse=True):
#        if ' // ' in k:
#            kd, ke = k.split(' // ')
#        else:
#            kd, ke = k, ''
#        f.write(kd+'\t'+ke+'\t'+str(fr)+'\n')
queue = sorted([n for n in categories.nodes() if len(n.split('.')) == 1])
text = ''
previous = 1
while queue:
    node = queue.pop(0)
    children = sorted([n for n in categories[node]])
    queue = children + queue
    indent = len(node.split('.'))-1
    if node.split('.')[-1] == '1':
        text += indent * ' ' + '<ul>'
    else:
        text += indent * ' '
    if previous > len(node.split('.')):
        uls = (previous - len(node.split('.'))) * '</ul>'
        text += uls + '\n'
    text += '<li>'+categories.node[node]['value']+'</li>\n'
    previous = len(node.split('.'))
    print(text)
    input()


    
