# -*- coding:utf-8 -*-
import matplotlib.pyplot as plt
import pandas as pd
import os
import numpy as np
from scipy import stats
from scipy.fftpack import fft
from math import ceil,floor
import sys

params={}
params['path']="X:\\xxx\\xxx\\"    #输入文件路径(精确到文件夹带"\\" 外部输入请勿携带空格)
params['opath']="X:\\xxx\\xxx\\"    #输出文件路径(精确到文件夹带"\\" 外部输入请勿携带空格)
params['clusters']=32
params['overlap']=0.9375
params['lenth']=2048
argvs=sys.argv

for i in range(len(argvs)):
    if i < 1:
        continue
    if argvs[i].split('=')[1] == 'None':
        params[argvs[i].split('=')[0]] = None
    else:
        Type = type(params[argvs[i].split('=')[0]])
        params[argvs[i].split('=')[0]] = Type(argvs[i].split('=')[1])


name=os.listdir(params['path'])

lenth=params['lenth']
step=floor(lenth/params['clusters']/2)
overlap=floor(lenth*(1-params['overlap']))
for i in name:
    topath=params['opath']
    if not os.path.isdir(topath):
        os.makedirs(topath)
    topath=topath+i
    if os.path.isfile(topath):
        continue
    data=pd.read_csv(params['path']+i)
    label=-1
    rpm=-1
    if data.__contains__('Label'):
        label=int(data['Label'].mean())
        del data['Label']
    if data.__contains__('RPM'):
        rpm=int(data['RPM'].mean())
        del data['RPM']
    odata=pd.DataFrame()
    for j in data.columns:
        y=pd.DataFrame()
        for k in range(0,len(data[j]),overlap):
            x=data[j][k:k+lenth]
            if len(x)<lenth:
                break
            fft_y=2*abs(fft(x,lenth)/lenth)[0:int(lenth/2)]
            y=y.append({j+'_p'+str(l):(fft_y[l*step:(l+1)*step]**2).mean() for l in range(0,params['clusters'])},
                        ignore_index=True)
        odata=pd.concat([odata,y],axis=1)
    if not rpm==-1:
        odata['RPM']=rpm
    if not label==-1:
        odata['Label']=label
    odata.to_csv(topath,index=False)
        