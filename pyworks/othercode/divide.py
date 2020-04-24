# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import os
import sys
from sklearn.model_selection import train_test_split as tts

param={}
param['ipath']="X:\\xxx\\xxx\\"        #源数据文件输入路径(精确到目录 需已过预处理和特征提取)
param['opath']="X:\\xxx\\xxx\\"        #目的文件输出路径(精确到目录)
param['te_fsize']=1000        #测试集每个文件长度
param['tr_rate']=0.8        #训练数据最大占比(最少数据量分类下的训练数据占比)
param['cent']=1
tr_size=0        #测试集长度(用于做测试集数据均衡 不需要调整 程序里有自适应)

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
param['tr_rate']=param['tr_rate']/param['cent']
data={}

catalogs=['B','OR','NORMAL','IR']

for log in catalogs:
    data[log]=pd.DataFrame()

names=os.listdir(param['ipath'])

for name in names:
    _data=pd.read_csv(param['ipath']+name)
    data[name.split('0')[0].split('1')[0]]=data[name.split('0')[0].split('1')[0]].append(_data,ignore_index=True)

tr_size=int(min([len(data[log]) for log in catalogs])*param['tr_rate'])

trp=param['opath']+'train\\'        #训练集存放目录 该目录后期需作为test参数填入
tep=param['opath']+'test\\'        #测试集存放目录 同上
for p in [trp,tep]:
    if not os.path.isdir(p):
        os.makedirs(p)

count=1
for log in catalogs:
    labels=data[log].columns
    tr_data,te_data=tts(np.array(data[log]),test_size=(len(data[log])-tr_size)/len(data[log]))
    pd.DataFrame(tr_data,columns=labels).to_csv(trp+log+'.csv',index=False)
    for i in range(0,len(te_data),param['te_fsize']):
        pd.DataFrame(te_data[i:i+param['te_fsize']],columns=labels).to_csv(tep+'test'+str(count)+'_'+log+'.csv',index=False)
        count=count+1


    