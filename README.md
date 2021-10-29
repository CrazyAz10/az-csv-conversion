# haohan_official_website

#### 介绍
##### 1.安装node环境

##### 2.命令说明
	node ./main.js --time 按多少分钟一条数据聚合 --path excel表文件路径 --exportPath 最终导出路径
案例：
	node ./main.js --time 15 --path "./Exness_BTCUSDm_2021_09.csv" --exportPath="C:\Users\CrazyAz\Desktop\"
	 将./Exness_BTCUSDm_2021_09.csv 文件 按15分钟间隔聚合成一条数据 重新导出到 C:\Users\CrazyAz\Desktop\ 目录下

	文件过大时可加内存
	文件过大 加入参数加内存 --max_old_space_size=12288
	node --max_old_space_size=12288 ./main.js --time 15 --path "./Exness_BTCUSDm_2020.csv" --exportPath="C:\Users\CrazyAz\Desktop\"