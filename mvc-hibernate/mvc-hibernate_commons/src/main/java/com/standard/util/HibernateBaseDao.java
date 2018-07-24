package com.standard.util;

import java.io.Serializable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.hibernate.metadata.ClassMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.util.Assert;


/**
 * 数据访问对象基类。
 */
@SuppressWarnings("unchecked")
public abstract class HibernateBaseDao<T, PK extends Serializable> {

	protected static final Logger logger = Logger
			.getLogger(HibernateBaseDao.class);

	protected Class<T> entityClass;

	@Autowired
	HibernateTemplate hibernateTemplate;

	@Autowired
	JdbcTemplate jdbcTemplate;

	/**
	 * 用于扩展的DAO子类使用的构造函数.
	 * <p/>
	 * 通过子类的范型定义取得对象类型Class. eg. public class UserDao extends
	 * SimpleHibernateDao<User, Long>
	 */
	public HibernateBaseDao() {
		this.entityClass = ReflectionUtils.getSuperClassGenricType(getClass());
	}

	protected Session getSession() {
		return hibernateTemplate.getSessionFactory().getCurrentSession();
	}

	// public int getNextId() {
	// String hql = "select max(id) from " + entityClass.getSimpleName();
	// Query query = getSession().createQuery(hql);
	// Object obj = query.uniqueResult();
	// if (obj == null) {
	// return 1;
	// } else {
	// return (Integer) obj + 1;
	// }
	// }

	/**
	 * 保存新增或修改的对象.
	 */
	public void save(final T entity) {

		Assert.notNull(entity);

		hibernateTemplate.save(entity);
	}

	/**
	 * 保存新增或修改的对象.
	 */
	public void modify(final T entity) {

		Assert.notNull(entity);

		hibernateTemplate.update(entity);
	}

	/**
	 * 删除对象.
	 *
	 * @param entity
	 *            对象必须是session中的对象或含id属性的transient对象.
	 */
	public void delete(final T entity) {
		if (entity == null) {
			return;
		}

		hibernateTemplate.delete(entity);
	}

	/**
	 * 按id删除对象.
	 */
	public void delete(final PK id) {
		if (id == null) {
			return;
		}
		delete(get(id));
	}

	/**
	 * 按id获取对象.
	 */
	public T get(final PK id) {
		Assert.notNull(id);
		return (T) hibernateTemplate.get(entityClass, id);
	}

	/**
	 * 获取全部对象.
	 */
	public List<T> getAll() {
		return findByCriteria();
	}

	/**
	 * 按属性查找对象列表,匹配方式为相等.
	 */
	public List<T> findByProperty(final String propertyName, final Object value) {
		Assert.hasText(propertyName);
		Criterion criterion = Restrictions.eq(propertyName, value);
		return findByCriteria(criterion);
	}

	/**
	 * 按属性查找唯一对象,匹配方式为相等.
	 */
	public T findUniqueByProperty(final String propertyName, final Object value) {
		Assert.hasText(propertyName);
		Criterion criterion = Restrictions.eq(propertyName, value);
		return (T) createCriteria(criterion).uniqueResult();
	}

	/**
	 * 按HQL查询对象列表.
	 *
	 * @param values
	 *            数量可变的参数
	 */
	public int update(final String hql, final Object... values) {
		return createQuery(hql, values).executeUpdate();
	}

	/**
	 * 按HQL查询对象列表.
	 *
	 * @param values
	 *            数量可变的参数
	 */
	public List<T> find(final String hql, final Object... values) {
		return createQuery(hql, values).list();
	}

	/**
	 * 按HQL查询对象列表.
	 *
	 * @param values
	 *            数量可变的参数
	 */
	public List<Object[]> findArray(final String hql, final Object... values) {
		return createQuery(hql, values).list();
	}

	/**
	 * 按HQL查询对象列表.
	 *
	 * @param values
	 *            数量可变的参数
	 */
	public List<T> findPage(final String hql, int limit, int size,
			final Object... values) {
		return createQuery(hql, values).setFirstResult(limit)
				.setMaxResults(size).list();
	}

	/**
	 * 按HQL查询对象列表.
	 *
	 * @param values
	 *            数量可变的参数
	 */
	public List<Object> findList(final String hql, final Object... values) {
		return createQuery(hql, values).list();
	}

	@SuppressWarnings("rawtypes")
	public List<T> findIn(final String hql, final String placeHolder,
			final List values) {
		return createQueryIn(hql, placeHolder, values).list();
	}

	/**
	 * 按HQL查询唯一对象.
	 */
	public T findUnique(final String hql, final Object... values) {
		return (T) createQuery(hql, values).uniqueResult();
	}

	/**
	 * 按HQL查询Integer类型结果.
	 */
	public Integer findInt(final String hql, final Object... values) {
		return (Integer) findUnique(hql, values);
	}

	/**
	 * 按HQL查询Long类型结果.
	 */
	public Long findLong(final String hql, final Object... values) {
		return (Long) findUnique(hql, values);
	}

	/**
	 * 根据查询HQL与参数列表创建Query对象.
	 * <p/>
	 * 返回对象类型不是Entity时可用此函数灵活查询.
	 *
	 * @param values
	 *            数量可变的参数
	 */
	public Query createQuery(final String queryString, final Object... values) {
		Assert.hasText(queryString);
		Query query = getSession().createQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);
			}
		}
		return query;
	}

	@SuppressWarnings("rawtypes")
	public Query createQueryIn(final String queryString,
			final String placeHolder, final List values) {
		Assert.hasText(queryString);
		Query query = getSession().createQuery(queryString);
		if (values != null) {
			query.setParameterList(placeHolder, values);
		}
		return query;
	}

	/**
	 * 按Criteria查询对象列表.
	 *
	 * @param criterions
	 *            数量可变的Criterion.
	 */
	public List<T> findByCriteria(final Criterion... criterions) {
		return createCriteria(criterions).list();
	}

	public T findUnique(final Criterion... criterions) {
		return (T) createCriteria(criterions).uniqueResult();
	}

	/**
	 * 根据Criterion条件创建Criteria.
	 * <p/>
	 * 返回对象类型不是Entity时可用此函数灵活查询.
	 *
	 * @param criterions
	 *            数量可变的Criterion.
	 */
	public Criteria createCriteria(final Criterion... criterions) {
		Criteria criteria = getSession().createCriteria(entityClass);
		for (Criterion c : criterions) {
			criteria.add(c);
		}
		return criteria;
	}

	/**
	 * 判断对象的属性值在数据库内是否唯一.
	 * <p/>
	 * 在修改对象的情景下,如果属性新修改的值(value)等于属性原来的值(orgValue)则不作比较.
	 */
	public boolean isPropertyUnique(final String propertyName,
			final Object newValue, final Object orgValue) {
		if (newValue == null || newValue.equals(orgValue))
			return true;
		Object object = findUniqueByProperty(propertyName, newValue);
		return (object == null);
	}

	/**
	 * 取得对象的主键名.
	 */
	public String getIdName() {
		ClassMetadata meta = hibernateTemplate.getSessionFactory()
				.getClassMetadata(entityClass);
		Assert.notNull(meta, "Class " + entityClass.getSimpleName()
				+ " not define in HibernateSessionFactory.");
		return meta.getIdentifierPropertyName();
	}

	/**
	 * 根据查询SQL与参数列表创建Query对象.
	 * 
	 * @param querySql
	 * @param values
	 * @return
	 */
	public SQLQuery createSqlQuery(final String querySql,
			final Object... values) {
		Assert.hasText(querySql);
		SQLQuery sqlQuery = getSession().createSQLQuery(querySql);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				sqlQuery.setParameter(i, values[i]);
			}
		}
		return sqlQuery;
	}

	public void initParamCondition(Map<String, Object> hqlParam, Query query) {
		Iterator<Entry<String, Object>> it = hqlParam.entrySet().iterator();
		while (it.hasNext()) {
			Entry<String, Object> en = it.next();
			Object obj = en.getValue();
			if (obj instanceof String) {
				query.setParameter(en.getKey(), en.getValue());
			} else if (obj instanceof String[]) {
				query.setParameterList(en.getKey(), (String[]) obj);
			} else if (obj instanceof Integer) {
				query.setInteger(en.getKey(), (Integer) obj);
			}
		}
	}

	public void batchInsert(String sql, BatchPreparedStatementSetter object) {
		jdbcTemplate.batchUpdate(sql, object);
	}
}
