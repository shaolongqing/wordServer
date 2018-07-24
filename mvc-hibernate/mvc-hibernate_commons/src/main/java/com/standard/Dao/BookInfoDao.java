package com.standard.Dao;

import java.io.Serializable;




import java.util.List;






import org.springframework.stereotype.Repository;

import com.standard.domain.BookInfo;
import com.standard.util.HibernateBaseDao;

@Repository
public class BookInfoDao extends HibernateBaseDao<BookInfo, Serializable>{
	public List<BookInfo> getBokkList(){
		String hql = "from BookInfo as u  where u.pageNum = ? ";
		return find(hql, 5);
	}
	
}
