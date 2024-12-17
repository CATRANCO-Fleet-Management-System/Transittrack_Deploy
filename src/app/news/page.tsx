import { FC } from 'react';
import Header from '/CATRANCO FRONTEND/FE-CAPSTION/src/components/Header';
import Footer from '/CATRANCO FRONTEND/FE-CAPSTION/src/components/Footer';

const BlogPage: FC = () => {
  return (
    <>
      <Header />
      <section id="bloglist" className="section-padding">
        <div className="auto-container">
          <div className="row mb-lg-5 mb-0">
            <div className="col-lg-8 col-md-8 col-12">
              {/* Blog Post 1 */}
              <div className="single-blog-post wow fadeInUp">
                <div className="single-blog-post-wrap">
                  <div className="single-blog-post-icon">
                    <i className="icofont-file-wmv"></i>
                  </div>
                  <div className="single-blog-post-content">
                    <h4 className="single-blog-post-title">
                      <a href="#">News 1</a>
                    </h4>
                    <div className="single-blog-post-gallery">
                      <div className="gallery-slides-wrapper owl-carousel owl-theme">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div className="item" key={i}>
                            <div className="gallery-slides-inner">
                              <figure>
                                <img className="img-fluid" src={`/assets/img/service/${i}.jpg`} alt={`Image Caption ${i}`} />
                                <figcaption className="overlay text-center">Image Caption {i}.</figcaption>
                              </figure>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p>Pellentesque habitant morbi...</p>
                    <a href="#" className="btn-default">Read More</a>
                  </div>
                </div>
              </div>

              {/* Blog Post 2 */}
              {/* Add more blog posts as needed */}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4 col-md-4 col-12">
              <aside className="widget-area">
                <div className="widget widget_search">
                  <form>
                    <input type="search" className="form-control" placeholder="Search..." />
                    <button type="submit"><i className="icofont-search-1"></i></button>
                  </form>
                </div>

                {/* Other Sidebar Widgets */}
              </aside>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BlogPage;
