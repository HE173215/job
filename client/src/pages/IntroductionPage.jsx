import React, { useEffect, useState } from 'react';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingSpinner from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import introductionService from '../services/introductionService';
import { Shield, Award } from 'lucide-react';

export function IntroductionPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    introductionService.getPublic()
      .then((data) => {
        if (mounted) setContent(data);
      })
      .catch((requestError) => {
        if (mounted) setError(requestError.message || 'Không thể tải nội dung giới thiệu.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  return (
    <div className="py-16 bg-dark-section min-h-screen">
      <Container>
        {loading && <LoadingSpinner text="Đang tải nội dung giới thiệu..." />}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)} />
        )}

        {!loading && !error && content && (
          <>
            <SectionTitle
              badge={content.badge}
              title={content.title}
              subtitle={content.subtitle}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 rounded-military bg-army-maroon/60 border border-army-gold/30 shadow-card-dark">
                <h3 className="text-xl font-serif font-bold text-army-gold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {content.functionTitle}
                </h3>
                {content.functionParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-sm text-army-ivory/85 leading-relaxed ${index < content.functionParagraphs.length - 1 ? 'mb-4' : ''}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="p-8 rounded-military bg-army-maroon/60 border border-army-gold/30 shadow-card-dark">
                <h3 className="text-xl font-serif font-bold text-army-gold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {content.trainingTitle}
                </h3>
                {content.trainingParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-sm text-army-ivory/85 leading-relaxed ${index < content.trainingParagraphs.length - 1 ? 'mb-4' : ''}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="p-4 rounded bg-army-black/60 border border-army-gold/20 text-center text-xs text-army-muted">
              {content.notice}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default IntroductionPage;
