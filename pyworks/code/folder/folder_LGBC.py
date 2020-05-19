# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import os
import sys
import joblib

param={}
param['model']="xxx.model"
param['test']="X:\\xxx\\xxx\\"        #测试集文件目录(精确到目录带"\\" 外部输入请勿携带空格)
param['opath']="xxx.csv"        #输出文件路径(精确到后缀)

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
    test=np.array(pd.read_csv(fn))[:,:]    #读取测试文件全部列
    test[np.isnan(test)]=0
    return clf.predict(test)


def GetRes(fp,clf):
    odata=pd.DataFrame()
    names=os.listdir(fp)
    for name in names:
        pre=GetPre(fp+name,clf)
        res=np.argmax([len(pre[pre==i]) for i in [0,1,2,3]])    #获取pre结果中最多的预测结果
        temp=pd.DataFrame({'label':[res],'filename':[name.split('.csv')[0]]})    #按要求添加行数据
        odata=odata.append(temp,ignore_index=True)
    op=param['opath'].replace(param['opath'].split('\\')[-1],"")
    if not os.path.isdir(op):
        os.makedirs(op)
    odata=odata.reindex(columns=['label','filename'])
    odata.to_csv(param['opath'],index=False)
    print(odata)
    
argvs=sys.argv
GetParams(param,argvs)
if not os.path.isdir(param['test']):
    print("test path "+param['test']+" is not exist")
    exit()

GetRes(param['test'],joblib.load(param['model']))

