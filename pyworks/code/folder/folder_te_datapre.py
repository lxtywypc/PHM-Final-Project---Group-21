# -*- coding:utf-8 -*-
import pandas as pd
import numpy as np
import os
import sys

param={}
param['path']="E:\\Chrome Downloads\\CWRU0325\\test\\"        #输入文件路径(精确到文件夹带"\\" 外部输入请勿携带空格)
param['opath']="E:\\pyworks\\data\\work\\homework\\"        #输出文件路径(精确到文件夹带"\\" 外部输入请勿携带空格)

def GetParams(params,argvs):
    for i in range(len(argvs)):
        if i < 1:
            continue
        if argvs[i].split('=')[1] == 'None':
            params[argvs[i].split('=')[0]] = None
        else:
            Type = type(params[argvs[i].split('=')[0]])
            params[argvs[i].split('=')[0]] = Type(argvs[i].split('=')[1])


argvs=sys.argv
GetParams(param,argvs)
Labels={'B':1,'IR':3,'NORMAL':0,'OR':2}
Features={'FE_time':0,'DE_time':0}
Columns=['DE_time','FE_time']
names=os.listdir(param['path'])

if not os.path.isdir(param['opath']):
    os.makedirs(param['opath'])

for name in names:
    data=pd.read_csv(param['path']+name)
    for fea in Features:
        if not data.__contains__(fea):
            data[fea]=Features[fea]
    for fea in data.columns:
        if not Features.__contains__(fea):
            del data[fea]
    data=data.reindex(columns=Columns)
    data.to_csv(param['opath']+name,index=False)