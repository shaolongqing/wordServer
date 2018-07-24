package com.standard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.standard.Dao.BookInfoDao;
import com.standard.domain.BookInfo;

@Service
@Transactional
public class BookInfoService {
	@Autowired
	private BookInfoDao bookInfoDao;
	
	
	public List<BookInfo> getBookList() {
		List<BookInfo> bokkList = bookInfoDao.getBokkList();
		System.out.println(bokkList);
		return bokkList;
	}
}
