# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import os
import sys
from lightgbm import LGBMClassifier as LGBC
from sklearn.neural_network import MLPClassifier as MLPC

param={}
            #建议使用前先过divide 如能看懂代码可按需修改
param['trp']="X:\\xxx\\"        #训练集文件路径(精确到目录带"\\")
param['tep']="X:\\xxx\\"        #测试集文件目录(精确到目录带"\\")
            #测试集文件列数、列名顺序需与训练集文件严格相等 不足请自行用0补齐
param['ressp']="X:\\xxx\\xxx.csv"
param['mark']='None'        #数据产生后的附加备注 以便横向对比 若不需要则保持None不变
param['exp']="X:\\xxx\\xxx.csv"

def GetParams(params,argvs):
    for i in range(len(argvs)):
        if i < 1:
            continue
        if argvs[i].split('=')[1] == 'None':
            params[argvs[i].split('=')[0]] = None
        else:
            Type = type(params[argvs[i].split('=')[0]])
            params[argvs[i].split('=')[0]] = Type(argvs[i].split('=')[1])


def GetTrain(fp):
    data=pd.DataFrame()
    names=os.listdir(fp)
    for name in names:
        _data=pd.read_csv(fp+name)
        data=data.append(_data,ignore_index=True)
    return data


def GetPre(fn,clf):
    test=np.array(pd.read_csv(fn))[:,:]
    test[np.isnan(test)]=0
    return clf.predict(test)


def GetRes(fp,clf):
    odata=pd.DataFrame()
    oerror=0
    names=os.listdir(fp)
    for name in names:
        pre=GetPre(fp+name,clf)
        res=np.argmax([len(pre[pre==i]) for i in [0,1,2,3]])        #选取所有预测结果中占比最高的作为最后的预测结果
        filename=[name.split('.csv')[0]]
        temp=pd.DataFrame({'label':[res],'filename':filename})
        #temp=pd.DataFrame({'label':pre})
        errorrate=len(pre[pre!=res])        #统计与最终结果不符的预测结果数
        if errorrate!=0:    #若预测结果不整齐 则舍弃该模型
            return
        odata=odata.append(temp,ignore_index=True)
    res=np.array(odata['label'])
    exp=np.array(pd.read_csv(param['exp'])['label'])
    if (res==exp).mean()<1:        #将最终预测结果与标准答案比对 若不能完美预测 则舍弃该模型
        return
    _osdata=pd.DataFrame()
    if os.path.isfile(param['ressp']):       #若输出文件已存在 则将结果添加至已有文件以便对比 若想覆盖写入 则从此行注释
        _osdata=pd.read_csv(param['ressp'])
    else:                                    #注释到此行结束 并调整下一行缩进
        op=param['ressp'].replace(param['ressp'].split('\\')[-1],"")
        if not os.path.isdir(op):
            os.makedirs(op)
    if not param['mark']=='None':
        oerror=pd.DataFrame({'mark':[param['mark']]})    #能够完美预测结果的模型保留并输出
    _osdata=pd.concat([_osdata,oerror],axis=1)
    _osdata.to_csv(param['ressp'],index=False)
    print(oerror)
    
argvs=sys.argv
GetParams(param,argvs)
if not os.path.isdir(param['trp']):
    print("train path "+param['trp']+" is not exist")
    exit()

if not os.path.isdir(param['tep']):
    print("test path "+param['tep']+" is not exist")
    exit()

data=GetTrain(param['trp'])
tr_x=np.array(data)[:,:-1]        #决定训练集是否需要删除最后x列(至少是-1 即删除标签列)
tr_y=np.array(data)[:,-1]
tr_x[np.isnan(tr_x)]=0
tr_y[np.isnan(tr_y)]=0


#for i in range(100,1100,100):	#需要循环调参作对比测试的话用这个 不需要的话注释掉整行并调整下一行缩进
GetRes(param['tep'],LGBC(
            n_estimators=300    #需要哪个参数就取消哪一行的注释 循环对比的话i的位置也可以调整 更多参数请自行查阅文档
            #,max_depth=-1        #参数列表也可不写 全部使用默认值
            #,learning_rate=0.1    #不使用i值时请注释for循环以免产生资源浪费
            ).fit(tr_x,tr_y))


"""
#说明同上 用哪个分类器自选 不使用的请注释以免产生资源浪费
GetRes(param['tep'],MLPC(
            alpha=0.0001
            #,max_iter=300
            #,tol=0.001
            ).fit(tr_x,tr_y))
"""

#还有很多分类器可以自行查阅资料尝试