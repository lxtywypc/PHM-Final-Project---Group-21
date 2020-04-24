# -*- coding:utf-8 -*-
import pandas as pd
import numpy as np
import sys

params={}
params['path']="xxx.csv"
params['opath']="xxx.csv"

argvs=sys.argv
Labels={'B':1,'IR':3,'NORMAL':0,'OR':2}
Features={'FE_time':0,'DE_time':0}
Columns=['DE_time','FE_time']

try:
    for i in range(len(argvs)):
        if i < 1:
            continue
        if argvs[i].split('=')[1] == 'None':
            params[argvs[i].split('=')[0]] = None
        else:
            Type = type(params[argvs[i].split('=')[0]])
            params[argvs[i].split('=')[0]] = Type(argvs[i].split('=')[1])

    data=pd.read_csv(params['path'])
    for fea in Features:
        if not data.__contains__(fea):
            data[fea]=Features[fea]
    for fea in data.columns:
        if not Features.__contains__(fea):
            del data[fea]
    data=data.reindex(columns=Columns)
    data.to_csv(params['opath'],index=False)
except Exception as e:
    print(e)