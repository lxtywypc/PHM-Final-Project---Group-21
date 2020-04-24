# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import sys
import joblib

param={}
param['test']="xxx.csv"
param['opath']="xxx.csv"
param['model']="xxx.model"


def GetParams(params,argvs):
    for i in range(len(argvs)):
        if i < 1:
            continue
        if argvs[i].split('=')[1] == 'None':
            params[argvs[i].split('=')[0]] = None
        else:
            Type = type(params[argvs[i].split('=')[0]])
            params[argvs[i].split('=')[0]] = Type(argvs[i].split('=')[1])


def GetPre(fn,clf):
    test=np.array(pd.read_csv(fn))
    test[np.isnan(test)]=0
    return clf.predict(test)

try:
    argvs=sys.argv
    GetParams(param,argvs)
    LGBC_Model=joblib.load(param['model'])
    pre=GetPre(param['test'],LGBC_Model)
    predict_df = pd.DataFrame(pre)
    predict_df.columns = ['predict']
    predict_df.to_csv(param['opath'],index=False)
except Exception as e:
    print(e)