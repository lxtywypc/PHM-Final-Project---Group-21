[FN]
file:处理单个文件 参数中路径文件夹必须存在 且不能夹带空格 预测结果为单个文件的一列预测数据
folder:处理整个文件夹文件 参数中路径文件夹可不存在 不能夹带空格 预测结果为所有文件的单个预测数据(每个输入文件只对应一个输出结果)

[FN]_te_datapre:数据预处理 参数:(输入文件路径)path=[file:xxx.csv/folder:xxx\xxx\(末尾"\"为必需)] (输出文件路径)opath=[格式同path]
[FN]_FreqWindow:特征提取 参数列表、格式同[FN]_te_datapre
[FN]_LGBC:机器学习 参数:(输入文件路径)test=[格式同 [FN]_te_datapre -path] (输出文件路径)opath=[xxx.csv] model=[xxx.model]

注：使用时建议使用folder/*.py，传入参数如上，其余参数请使用默认参数，其余详细注释参见代码页（仅folder/*.py）
