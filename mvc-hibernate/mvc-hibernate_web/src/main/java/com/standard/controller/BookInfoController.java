package com.standard.controller;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.standard.domain.BookInfo;
import com.standard.service.BookInfoService;
import com.standard.util.HttpClient;

@Controller
@RequestMapping(value="aa")
public class BookInfoController {
	@Autowired
	private BookInfoService bookInfoService;
	
	
	@RequestMapping(value="bb")
	public String test16(Model model){
		List<BookInfo> bookList = bookInfoService.getBookList();
		System.out.println(bookList);
		String URL = "https://blog.csdn.net";
		String name = "liqi_q";
		String art = "article";
		String det = "details";
		int num = 53128325;
		String getURL = String.format("/%s/%s/%s/%s", name,false,null,num);
		
		CloseableHttpClient httpCilent = HttpClients.createDefault();
		 RequestConfig requestConfig = RequestConfig.custom()
	                .setConnectTimeout(5000)   //设置连接超时时间
	                .setConnectionRequestTimeout(5000) // 设置请求超时时间
	                .setSocketTimeout(5000)
	                .setRedirectsEnabled(true)//默认允许自动重定向
	                .build();
		HttpGet httpGet = new HttpGet(URL+getURL);
		try {
//			HttpResponse httpResponse = httpCilent.execute(httpGet);
//		    String srtResult = EntityUtils.toString(httpResponse.getEntity());//获得返回的结果
		    String aa = "fd98ghfdipo54hgf234321lkdn,./;';4354hbjk";
		    
		    char[] chs = aa.toCharArray();
	        for(int i = 0; i < chs.length-1; i++){
	            for(int j = i+1; j<chs.length; j++){
	                if(chs[j] < chs[i]){
	                    char temp = chs[j];
	                    chs[j] = chs[i];
	                    chs[i] = temp;
	                }
	            }
		        }
	        aa = String.valueOf(chs);
		    System.out.println(aa);
		   // System.out.println(srtResult);
		} catch (Exception e) {
		    e.printStackTrace();
		}finally {
		    try {
		        httpCilent.close();//释放资源
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		}
		model.addAttribute("msg", "springmvc第一个注解程序,接收普通参数");
		return "index";
	}
	
	
}
