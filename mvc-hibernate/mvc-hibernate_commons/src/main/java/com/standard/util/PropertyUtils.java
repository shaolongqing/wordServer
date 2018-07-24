package com.standard.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 读取属性文件
 * 
 * @author zqwang2
 *
 */
public class PropertyUtils {
	private String fileName = "";

	public PropertyUtils(String fileName) {
		this.fileName = fileName;
	}

	public Properties getProperties() {
		Properties prop = new Properties();
		InputStream in = PropertyUtils.class.getClassLoader()
				.getResourceAsStream(fileName);
		try {
			prop.load(in);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return prop;
	}

	public String getValue(String key) {
		return getProperties().getProperty(key);
	}
}
