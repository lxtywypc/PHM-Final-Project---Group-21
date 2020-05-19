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
params['overlap']=0.5
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


name=os.listdir(params['path'])    #读取文件夹下所有文件

lenth=params['lenth']    #确定fft点数
step=floor(lenth/params['clusters']/2)    #确定单窗口内分组数据长度(单边谱)
overlap=floor(lenth*(1-params['overlap']))     #换算overlap长度
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
        del data['Label']    #删除无需fft列数据，下同
    if data.__contains__('RPM'):
        rpm=int(data['RPM'].mean())
        del data['RPM']
    odata=pd.DataFrame()
    for j in data.columns:    #遍历剩余列进行fft
        y=pd.DataFrame()
        for k in range(0,len(data[j]),overlap):    #按overlap长度循环
            x=data[j][k:k+lenth]
            if len(x)<lenth:
                break    #若剩余数据不足fft长度则舍去
            fft_y=2*abs(fft(x,lenth)/lenth)[0:int(lenth/2)]
            y=y.append({j+'_p'+str(l):(fft_y[l*step:(l+1)*step]**2).mean() for l in range(0,params['clusters'])},
                        ignore_index=True)
        odata=pd.concat([odata,y],axis=1)
    if not rpm==-1:
        odata['RPM']=rpm
    if not label==-1:
        odata['Label']=label
    odata.to_csv(topath,index=False)
        
