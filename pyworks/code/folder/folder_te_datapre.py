# -*- coding:utf-8 -*-
import pandas as pd
import numpy as np
import os
import sys

param={}
param['path']="X:\\xxx\\xxx\\"        #输入文件路径(精确到文件夹带"\\" 外部输入请勿携带空格)
param['opath']="X:\\xxx\\xxx\\"        #输出文件路径(精确到文件夹带"\\" 外部输入请勿携带空格)

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
        if not data.__contains__(fea):    #若输入文件不含所需列，则添加并置零
            data[fea]=Features[fea]
    for fea in data.columns:    #若输入文件含不在所需范围内列，则删除该列
        if not Features.__contains__(fea):
            del data[fea]
    label=name.split('0')[0].split('1')[0]
    """
    if Labels.__contains__(label):    #若文件为训练文件，则根据文件名添加label列，实际操作时使用已训练好模型，因此此段代码已废弃
        data['Label']=Labels[label]    #若需重新训练，可解除该段注释
    """
    data=data.reindex(columns=Columns)
    data.to_csv(param['opath']+name,index=False)
