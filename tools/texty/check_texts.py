# -*- coding: utf-8 -*-
import json, re, sys
ch = json.load(open(sys.argv[1], encoding="utf-8"))
zm = [c for c in ch if c["new"] != c["orig"]]
problem = {
    "novy riadok": [], "uvodzovka": [], "spatna lomka": [],
    "medzery na okraji": [], "html pribudlo": [], "html zmizlo": [], "prazdne": [],
}
for c in zm:
    n, o = c["new"], c["orig"]
    if "\n" in n or "\r" in n: problem["novy riadok"].append(c["row"])
    if chr(34) in n: problem["uvodzovka"].append(c["row"])
    if chr(92) in n: problem["spatna lomka"].append(c["row"])
    if n != n.strip(): problem["medzery na okraji"].append(c["row"])
    if not n.strip(): problem["prazdne"].append(c["row"])
    ho = len(re.findall(r"<[a-z/]+>", o))
    hn = len(re.findall(r"<[a-z/]+>", n))
    if hn > ho: problem["html pribudlo"].append(c["row"])
    if hn < ho: problem["html zmizlo"].append((c["row"], c["path"], o[:60]))
for k, v in problem.items():
    print("%-20s %s" % (k, v if v else "-"))
print("priemerna dlzka: povodne %.0f -> nove %.0f znakov" % (
    sum(len(c["orig"]) for c in zm) / len(zm), sum(len(c["new"]) for c in zm) / len(zm)))
print("najdlhsi novy:", max(len(c["new"]) for c in zm), "znakov")
